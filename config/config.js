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

	logLevel: [], // No logging at all
	timeFormat: 24,
	units: "metric",

	// Disable all console output
	electronOptions: {
		webPreferences: {
			webSecurity: false,
			nodeIntegration: false,
			contextIsolation: true
		}
	},

	modules: [
		// Clock and Date - Top Bar
		{
			module: "clock",
			position: "top_bar",
			config: {
				timeFormat: 24,
				showDate: true,
				showWeek: false,
				dateFormat: "dddd, MMMM Do YYYY",
				displayType: "digital",
				clockBold: false,
				showPeriod: false,
				showSunTimes: false,
				showMoonTimes: false,
				lat: null,
				lon: null,
				timezone: null
			}
		},

		// Google + Outlook Calendars - Top Bar
		{
			module: "calendar",
			header: "My Calendars",
			position: "top_bar",
			config: {
				calendars: [
					{
						fetchInterval: 5 * 60 * 1000, // 5 minutes
						symbol: "calendar-check",
						url: "https://calendar.google.com/calendar/ical/raghunani1437%40gmail.com/public/basic.ics",
						name: "Google Calendar",
						color: "#4285f4", // Google blue
						auth: {
							user: "",
							pass: "",
							method: "basic"
						}
					},
					{
						fetchInterval: 5 * 60 * 1000, // 5 minutes
						symbol: "calendar",
						url: "https://outlook.live.com/owa/calendar/00000000-0000-0000-0000-000000000000/7f1119da-7ece-4109-9a68-ea4e521b47ef/cid-46F8628E581F7C3D/calendar.ics",
						name: "Outlook Calendar",
						color: "#0078d4", // Outlook blue
						auth: {
							user: "",
							pass: "",
							method: "basic"
						}
					}
				],
				maximumEntries: 10,
				maximumNumberOfDays: 60,
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
				tableClass: "small",
				broadcastEvents: true,
				excludedEvents: [],
				sliceMultiDayEvents: false
			}
		},

		// Current Weather - Top Bar
		{
			module: "weather",
			position: "top_bar",
			header: "Current Weather",
			config: {
				weatherProvider: "openmeteo",
				type: "current",
				lat: 28.6139, // New Delhi coordinates
				lon: 77.2090, // New Delhi coordinates
				units: "metric",
				tempUnits: "metric",
				windUnits: "metric",
				updateInterval: 10 * 60 * 1000, // 10 minutes
				animationSpeed: 1000,
				showWindDirection: true,
				showWindDirectionAsArrow: false,
				showHumidity: true,
				showFeelsLike: true,
				showSun: false,
				showMoonTimes: false,
				colored: false, // Black and white theme
				roundTemp: true,
				degreeLabel: true
			}
		},

		// Location Display - Top Bar
		{
			module: "MMM-ip",
			position: "top_bar",
			config: {
				fontSize: 18,
				dimmed: true,
				showCity: true,
				showCountry: true,
				showFlag: false, // Black and white theme
				showIP: false,
				lang: "en"
			}
		},

		// News Feed - Top Bar
		{
			module: "newsfeed",
			position: "top_bar",
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
				scrollLength: 500
			}
		},

		// Photo Slideshow - Top Bar
		{
			module: "MMM-ImageSlideshow",
			position: "top_bar",
			config: {
				imagePaths: ["modules/MMM-ImageSlideshow/exampleImages"],
				slideshowSpeed: 12 * 1000, // 12 seconds
				delayUntilRestart: 0,
				fixedImageWidth: 120,
				fixedImageHeight: 80,
				randomizeImageOrder: true,
				treatAllPathsAsOne: false,
				makeImagesGrayscale: false,
				validImageFileExtensions: "bmp,jpg,jpeg,gif,png"
			}
		},

		// Compliments - Top Bar
		{
			module: "compliments",
			position: "top_bar",
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
				}
			}
		},

		// MMM-ModulePosition - Layout Control (ACTIVE)
		{
			module: "MMM-ModulePosition",
			position: "fullscreen_below",
			config: {
				text: "Drag & Resize Modules",
				easeAmount: 0.3,
				FPS: 15,
				minimum_size: 50,
				grid: 10,
				showAlerts: true
			}
		}
	]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") { module.exports = config; }
