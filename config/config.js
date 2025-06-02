/* Config Sample
 *
 * For more information on how you can configure this file
 * see https://docs.magicmirror.builders/configuration/introduction.html
 * and https://docs.magicmirror.builders/modules/configuration.html
 *
 * You can use environment variables using a `config.js.template` file instead of `config.js`
 * which will be converted to `config.js` while starting. For more information
 * see https://docs.magicmirror.builders/configuration/introduction.html#enviromnent-variables
 */
let config = {
	address: "0.0.0.0",	// Listen on all interfaces for server mode
	port: 8080,
	basePath: "/",
	ipWhitelist: [],	// Allow all IP addresses for testing

	useHttps: false,			// Support HTTPS or not, default "false" will use HTTP
	httpsPrivateKey: "",	// HTTPS private key path, only require when useHttps is true
	httpsCertificate: "",	// HTTPS Certificate path, only require when useHttps is true

	language: "en",
	locale: "en-US",   // this variable is provided as a consistent location
			   // it is currently only used by 3rd party modules. no MagicMirror code uses this value
			   // as we have no usage, we  have no constraints on what this field holds
			   // see https://en.wikipedia.org/wiki/Locale_(computer_software) for the possibilities

	logLevel: ["INFO", "LOG", "WARN", "ERROR", "DEBUG"], // Add "DEBUG" for even more logging
	timeFormat: 24,
	units: "metric",

	modules: [
		// System modules
		{
			module: "alert",
			config: {
				debug: true
			}
		},
		{
			module: "updatenotification",
			position: "top_bar",
			config: {
				debug: true
			}
		},

		// Clock and Date - Top Left
		{
			module: "clock",
			position: "top_left",
			config: {
				timeFormat: 24,
				showPeriod: false,
				showDate: true,
				showWeek: true,
				dateFormat: "dddd, MMMM Do YYYY",
				clockBold: true,
				timezone: null,
				showSunTimes: false,
				lat: null,
				lon: null,
				debug: true
			}
		},

		// Your Google Calendar - Top Left
		{
			module: "calendar",
			header: "📅 My Calendar",
			position: "top_left",
			config: {
				calendars: [
					{
						fetchInterval: 5 * 60 * 1000, // 5 minutes
						symbol: "calendar-check",
						url: "https://calendar.google.com/calendar/ical/raghunani1437%40gmail.com/public/basic.ics",
						name: "Personal Calendar"
					}
				],
				maximumEntries: 8,
				maximumNumberOfDays: 365,
				displaySymbol: true,
				defaultSymbol: "calendar",
				showLocation: false,
				displayRepeatingCountTitle: false,
				dateFormat: "MMM Do",
				timeFormat: "HH:mm",
				urgency: 7,
				getRelative: 6,
				fadePoint: 0.25,
				hidePrivate: false,
				hideOngoing: false,
				colored: false, // Black and white theme
				coloredSymbolOnly: false,
				debug: true,
				logFeedWarnings: true
			}
		},

		// Current Weather - Top Right
		{
			module: "weather",
			position: "top_right",
			header: "🌤️ Current Weather",
			config: {
				weatherProvider: "openmeteo",
				type: "current",
				lat: null, // Will be auto-detected via IP
				lon: null, // Will be auto-detected via IP
				units: "metric",
				tempUnits: "metric",
				windUnits: "metric",
				updateInterval: 10 * 60 * 1000, // 10 minutes
				animationSpeed: 1000,
				showWindDirection: true,
				showWindDirectionAsArrow: true,
				showHumidity: true,
				showSun: false,
				showFeelsLike: true,
				colored: false, // Black and white theme
				debug: true
			}
		},

		// Weather Forecast - Top Right
		{
			module: "weather",
			position: "top_right",
			header: "📊 5-Day Forecast",
			config: {
				weatherProvider: "openmeteo",
				type: "forecast",
				lat: null, // Will be auto-detected via IP
				lon: null, // Will be auto-detected via IP
				units: "metric",
				maxNumberOfDays: 5,
				showRainAmount: true,
				colored: false, // Black and white theme
				fade: true,
				fadePoint: 0.25,
				debug: true
			}
		},

		// Location Display - Top Center
		{
			module: "MMM-ip",
			position: "top_center",
			config: {
				fontSize: 18,
				dimmed: true,
				showCity: true,
				showCountry: true,
				showFlag: false, // Black and white theme
				showIP: false,
				lang: "en",
				debug: true
			}
		},

		// News Feed - Bottom Bar
		{
			module: "newsfeed",
			position: "bottom_bar",
			config: {
				feeds: [
					{
						title: "BBC News",
						url: "http://feeds.bbci.co.uk/news/rss.xml"
					},
					{
						title: "Reuters",
						url: "http://feeds.reuters.com/reuters/topNews"
					},
					{
						title: "CNN",
						url: "http://rss.cnn.com/rss/edition.rss"
					},
					{
						title: "TechCrunch",
						url: "http://feeds.feedburner.com/TechCrunch/"
					}
				],
				showSourceTitle: true,
				showPublishDate: true,
				broadcastNewsFeeds: true,
				broadcastNewsUpdates: true,
				showDescription: false,
				wrapTitle: true,
				wrapDescription: true,
				truncDescription: true,
				lengthDescription: 300,
				hideLoading: false,
				reloadInterval: 5 * 60 * 1000, // 5 minutes
				updateInterval: 15 * 1000, // 15 seconds
				animationSpeed: 2000,
				maxNewsItems: 0,
				ignoreOldItems: false,
				ignoreOlderThan: 24 * 60 * 60 * 1000, // 1 day
				removeStartTags: "",
				removeEndTags: "",
				startTags: [],
				endTags: [],
				prohibitedWords: [],
				scrollLength: 500,
				logFeedWarnings: true,
				debug: true
			}
		},

		// Photo Slideshow - Bottom Left
		{
			module: "MMM-ImageSlideshow",
			position: "bottom_left",
			config: {
				imagePaths: ["photos/"],
				slideshowSpeed: 12 * 1000, // 12 seconds
				delayUntilRestart: 0,
				fixedImageWidth: 320,
				fixedImageHeight: 240,
				randomizeImageOrder: true,
				treatImagePathsAsGlob: false,
				imageExts: ["bmp", "jpg", "jpeg", "gif", "png"],
				transitionImages: true,
				showImageInfo: false,
				backgroundColor: "#000000", // Black background
				transitions: ["opacity", "slideFromRight", "slideFromLeft"],
				transitionSpeed: "1.5s",
				recursiveSubDirectories: false,
				sortImagesBy: "created",
				sortImagesDescending: false,
				maxWidth: "100%",
				maxHeight: "100%",
				showProgressBar: false,
				debug: true
			}
		},

		// Compliments - Lower Third
		{
			module: "compliments",
			position: "lower_third",
			config: {
				updateInterval: 45000, // 45 seconds
				fadeSpeed: 3000,
				compliments: {
					anytime: [
						"Looking sharp today!",
						"You're making great progress!",
						"Stay focused and achieve greatness!",
						"Your dedication is inspiring!",
						"Excellence is your standard!"
					],
					morning: [
						"Good morning! Ready to conquer the day?",
						"Rise and shine, champion!",
						"Today holds endless possibilities!",
						"Start strong, finish stronger!"
					],
					afternoon: [
						"Afternoon momentum building!",
						"Keep pushing forward!",
						"You're in your prime time!",
						"Productivity at its peak!"
					],
					evening: [
						"Evening reflection time!",
						"Another day of achievements!",
						"Well-earned rest ahead!",
						"Tomorrow awaits your brilliance!"
					]
				},
				debug: true
			}
		}
	]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") { module.exports = config; }
