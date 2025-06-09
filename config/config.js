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
		// Clock and Date - Top Left (Clean & Minimalistic)
		{
			module: "clock",
			position: "top_left",
			config: {
				timeFormat: 24,
				showDate: true,
				showWeek: false,
				dateFormat: "MMM Do",
				displayType: "digital",
				clockBold: false,
				showPeriod: false,
				showSunTimes: false,
				showMoonTimes: false
			}
		},

		// Weather - Top Right (Clean Display)
		{
			module: "MMM-DynamicWeather",
			position: "top_right",
			config: {
				weatherProvider: "openmeteo",
				type: "current",
				units: "metric",
				tempUnits: "metric",
				updateInterval: 10 * 60 * 1000,
				animationSpeed: 1000,
				showWindDirection: false,
				showHumidity: false,
				showFeelsLike: false,
				showSun: false,
				colored: false,
				roundTemp: true,
				degreeLabel: true,
				showDescription: false,
				useLocationFromSimpleLocation: true,
				debug: false
			}
		},

		// Calendar - Left Side (Organized)
		{
			module: "calendar",
			header: "Calendar",
			position: "top_left",
			config: {
				calendars: [
					{
						fetchInterval: 5 * 60 * 1000,
						symbol: "calendar-check",
						url: "https://calendar.google.com/calendar/ical/raghunani1437%40gmail.com/public/basic.ics",
						name: "Google Calendar"
					},
					{
						fetchInterval: 5 * 60 * 1000,
						symbol: "calendar",
						url: "https://outlook.live.com/owa/calendar/00000000-0000-0000-0000-000000000000/35d23965-43f8-4e5e-8162-9a29b9f6ec76/cid-46F8628E581F7C3D/calendar.ics",
						name: "Outlook Calendar"
					}
				],
				maximumEntries: 8,
				maximumNumberOfDays: 30,
				displaySymbol: false,
				showLocation: false,
				dateFormat: "MMM Do",
				timeFormat: "HH:mm",
				urgency: 7,
				getRelative: 6,
				fadePoint: 0.25,
				colored: false,
				tableClass: "small"
			}
		},

		// News Feed - Bottom Bar (Minimalistic)
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
						title: "TechCrunch",
						url: "http://feeds.feedburner.com/TechCrunch/"
					}
				],
				showSourceTitle: false,
				showPublishDate: false,
				showDescription: false,
				wrapTitle: true,
				truncDescription: true,
				lengthDescription: 200,
				reloadInterval: 5 * 60 * 1000,
				updateInterval: 15 * 1000,
				animationSpeed: 2000,
				maxNewsItems: 5,
				scrollLength: 500
			}
		},

		// Compliments - Lower Third (Centered)
		{
			module: "compliments",
			position: "lower_third",
			config: {
				updateInterval: 30000,
				fadeSpeed: 2000,
				compliments: {
					anytime: [
						"Looking great today!",
						"Stay focused!",
						"You've got this!"
					],
					morning: [
						"Good morning!",
						"Ready for today?"
					],
					afternoon: [
						"Keep going!",
						"Almost there!"
					],
					evening: [
						"Well done today!",
						"Time to relax!"
					]
				}
			}
		},

		// Location Display - Top Center (Minimal)
		{
			module: "MMM-SimpleLocation",
			position: "top_center",
			config: {
				dimmed: true,
				showCity: true,
				showCountry: false,
				useGeolocation: true,
				broadcastLocation: true,
				updateInterval: 30 * 60 * 1000
			}
		},

		// WSL Voice Control - Hidden Helper
		{
			module: "MMM-WSLVoice",
			position: "fullscreen_below",
			config: {
				debug: false,
				enableVisualFeedback: true,
				feedbackDuration: 2000,
				bridgePort: 3001,
				commands: {
					"magic mirror show weather": "WEATHER_SHOW",
					"magic mirror hide weather": "WEATHER_HIDE",
					"magic mirror show calendar": "CALENDAR_SHOW",
					"magic mirror hide calendar": "CALENDAR_HIDE",
					"magic mirror show news": "NEWS_SHOW",
					"magic mirror hide news": "NEWS_HIDE",
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
