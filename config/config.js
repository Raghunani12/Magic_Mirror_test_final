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
		// Clock - Top Center
		{
			module: "clock",
			position: "top_center",
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

		// SimpleLocation - Below Clock (Upper Third)
		{
			module: "MMM-SimpleLocation",
			position: "upper_third",
			config: {
				dimmed: true,
				city: "New Delhi", // Fallback city
				country: "India", // Fallback country
				fallbackLat: 28.6139, // Fallback latitude
				fallbackLon: 77.2090, // Fallback longitude
				showCity: true,
				showCountry: true,
				useGeolocation: true, // Enable IP geolocation
				broadcastLocation: true, // Broadcast to weather module
				updateInterval: 30 * 60 * 1000, // Update every 30 minutes
				retryAttempts: 3
			}
		},

		// Calendar - Left Side
		{
			module: "calendar",
			header: "My Calendars",
			position: "top_left",
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
						url: "https://outlook.live.com/owa/calendar/00000000-0000-0000-0000-000000000000/35d23965-43f8-4e5e-8162-9a29b9f6ec76/cid-46F8628E581F7C3D/calendar.ics",
						name: "Outlook Calendar",
						color: "#0078d4", // Outlook blue
						auth: {
							user: "",
							pass: "",
							method: "basic"
						}
					}
				],
				maximumEntries: 6,
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

		// Dynamic Weather - Right Side (Same Line as Calendar)
		{
			module: "MMM-DynamicWeather",
			position: "top_right",
			header: "Current Weather",
			config: {
				weatherProvider: "openmeteo",
				type: "current",
				lat: 28.6139, // Fallback coordinates (New Delhi)
				lon: 77.2090, // Fallback coordinates (New Delhi)
				units: "metric",
				tempUnits: "metric",
				windUnits: "metric",
				updateInterval: 10 * 60 * 1000, // 10 minutes
				animationSpeed: 1000,
				showWindDirection: true,
				showWindDirectionAsArrow: false,
				showHumidity: true,
				showFeelsLike: true,
				showWindSpeed: true, // Show wind speed
				showSun: false,
				showMoonTimes: false,
				colored: false, // Black and white theme
				roundTemp: true,
				degreeLabel: true,
				showDescription: true, // Show weather description
				useLocationFromSimpleLocation: true, // Enable dynamic location updates
				locationUpdateDelay: 5000, // Wait 5s after location update before fetching weather
				debug: false // Set to true for troubleshooting
			}
		},



		// News Feed - Bottom
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
				scrollLength: 500
			}
		},

		// Image Slideshow - Left Side (with padding) - PERCENTAGE BASED RESPONSIVE
		{
			module: "MMM-ImageSlideshow",
			position: "bottom_left",
			config: {
				imagePaths: ["modules/MMM-ImageSlideshow/exampleImages"],
				slideshowSpeed: 12 * 1000, // 12 seconds per image
				delayUntilRestart: 0,
				fixedImageWidth: 0, // Use CSS percentage-based sizing instead
				fixedImageHeight: 0, // Use CSS percentage-based sizing instead
				randomizeImageOrder: true,
				treatAllPathsAsOne: false,
				makeImagesGrayscale: false, // Set to true for black/white theme
				validImageFileExtensions: "bmp,jpg,jpeg,gif,png",
				backgroundOpacity: 0.3, // Enhanced background opacity
				transitionImages: true, // Smooth transitions
				maxWidth: "12vw", // PERCENTAGE BASED - INCREASED for better visibility
				maxHeight: "8vh" // PERCENTAGE BASED - INCREASED for better visibility
			}
		},

		// Compliments - Center
		{
			module: "compliments",
			position: "bottom_center",
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

		// MMM-ModulePosition - Layout Control (COMMENTED OUT FOR STABLE LAYOUT)
		/*
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
		},
		*/

		// WSL Voice Control - Browser-Based (WSL Compatible)
		{
			module: "MMM-WSLVoice",
			position: "bottom_right",
			config: {
				debug: false, // Set to true for troubleshooting
				enableVisualFeedback: true,
				feedbackDuration: 3000,
				bridgePort: 3001, // Port for voice control web interface
				commands: {
					// Natural language commands (case insensitive)
					"magic mirror show weather": "WEATHER_SHOW",
					"magic mirror hide weather": "WEATHER_HIDE",
					"magic mirror show calendar": "CALENDAR_SHOW",
					"magic mirror hide calendar": "CALENDAR_HIDE",
					"magic mirror show news": "NEWS_SHOW",
					"magic mirror hide news": "NEWS_HIDE",
					"magic mirror show photos": "PHOTOS_SHOW",
					"magic mirror hide photos": "PHOTOS_HIDE",
					"magic mirror refresh": "REFRESH_MIRROR",
					"magic mirror good morning": "GOOD_MORNING",
					"magic mirror good night": "GOOD_NIGHT"
				}
			}
		}
	]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") { module.exports = config; }
