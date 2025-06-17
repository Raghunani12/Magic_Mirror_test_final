const crypto = require("node:crypto");
const { htmlToText } = require("html-to-text");
const Log = require("logger");
const NodeHelper = require("node_helper");

/**
 * Responsible for requesting NewsAPI.org data and broadcasting the data.
 * @param {string} url URL of the NewsAPI endpoint.
 * @param {number} reloadInterval Reload interval in milliseconds.
 * @param {boolean} logFeedWarnings If true log warnings when there is an error parsing a news article.
 * @param {boolean} useCorsProxy If true cors proxy is used for article url's.
 * @class
 */
const NewsAPIFetcher = function (url, reloadInterval, logFeedWarnings, useCorsProxy) {
	let reloadTimer = null;
	let items = [];
	let reloadIntervalMS = reloadInterval;

	let fetchFailedCallback = function () {};
	let itemsReceivedCallback = function () {};

	if (reloadIntervalMS < 1000) {
		reloadIntervalMS = 1000;
	}

	/* private methods */

	/**
	 * Request the new items from NewsAPI.org.
	 */
	const fetchNews = () => {
		clearTimeout(reloadTimer);
		reloadTimer = null;
		items = [];

		const nodeVersion = Number(process.version.match(/^v(\d+\.\d+)/)[1]);
		const headers = {
			"User-Agent": `Mozilla/5.0 (Node.js ${nodeVersion}) MagicMirror/${global.version}`,
			"Cache-Control": "max-age=0, no-cache, no-store, must-revalidate",
			Pragma: "no-cache"
		};

		fetch(url, { headers: headers })
			.then(NodeHelper.checkFetchStatus)
			.then((response) => response.json())
			.then((data) => {
				if (data.status === "ok" && data.articles) {
					data.articles.forEach((article) => {
						const title = article.title;
						let description = article.description || article.content || "";
						const pubdate = article.publishedAt;
						const articleUrl = article.url || "";
						const source = article.source?.name || "Unknown Source";

						if (title && pubdate) {
							// Convert HTML entities and clean description
							if (description) {
								description = htmlToText(description, {
									wordwrap: false,
									selectors: [
										{ selector: "a", options: { ignoreHref: true, noAnchorUrl: true } },
										{ selector: "br", format: "inlineSurround", options: { prefix: " " } },
										{ selector: "img", format: "skip" }
									]
								});
							}

							items.push({
								title: title,
								description: description,
								pubdate: pubdate,
								url: articleUrl,
								sourceTitle: source,
								useCorsProxy: useCorsProxy,
								hash: crypto.createHash("sha256").update(`${pubdate} :: ${title} :: ${articleUrl}`).digest("hex")
							});
						} else if (logFeedWarnings) {
							Log.warn("Can't parse NewsAPI article:");
							Log.warn(article);
							Log.warn(`Title: ${title}`);
							Log.warn(`Description: ${description}`);
							Log.warn(`Pubdate: ${pubdate}`);
						}
					});

					this.broadcastItems();
				} else {
					Log.error("NewsAPI Error:", data.message || "Unknown error");
					fetchFailedCallback(this, new Error(data.message || "NewsAPI request failed"));
				}
				scheduleTimer();
			})
			.catch((error) => {
				Log.error("NewsAPI Fetch Error:", error);
				fetchFailedCallback(this, error);
				scheduleTimer();
			});
	};

	/**
	 * Schedule the timer for the next update.
	 */
	const scheduleTimer = function () {
		clearTimeout(reloadTimer);
		reloadTimer = setTimeout(function () {
			fetchNews();
		}, reloadIntervalMS);
	};

	/* public methods */

	/**
	 * Update the reload interval, but only if we need to increase the speed.
	 * @param {number} interval Interval for the update in milliseconds.
	 */
	this.setReloadInterval = function (interval) {
		if (interval > 1000 && interval < reloadIntervalMS) {
			reloadIntervalMS = interval;
		}
	};

	/**
	 * Initiate fetchNews();
	 */
	this.startFetch = function () {
		fetchNews();
	};

	/**
	 * Broadcast the existing items.
	 */
	this.broadcastItems = function () {
		if (items.length <= 0) {
			Log.info("NewsAPI-Fetcher: No items to broadcast yet.");
			return;
		}
		Log.info(`NewsAPI-Fetcher: Broadcasting ${items.length} items.`);
		itemsReceivedCallback(this);
	};

	this.onReceive = function (callback) {
		itemsReceivedCallback = callback;
	};

	this.onError = function (callback) {
		fetchFailedCallback = callback;
	};

	this.url = function () {
		return url;
	};

	this.items = function () {
		return items;
	};
};

module.exports = NewsAPIFetcher;
