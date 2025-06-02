# 🪞 Professional Smart Mirror - Black & White Animated Theme

A sleek, modern smart mirror solution built with MagicMirror² featuring personal Google Calendar integration, weather, news, photos, and location detection with stunning black and white animations.

**🎯 Customized for:** raghunani1437@gmail.com  
**🎨 Theme:** Professional Black & White with Smooth Animations  
**📱 Access:** http://localhost:8080 or http://YOUR_IP:8080  
**📂 Repository:** https://github.com/Raghunani12/Magic_Mirror_test_final.git

## ✨ Features

- **⏰ Animated Clock & Date** - Large, pulsing clock with smooth animations
- **🌤️ Weather with Animations** - Current weather and 5-day forecast with floating icons
- **📍 IP Geolocation** - Automatically detects your location
- **📅 Your Google Calendar** - Integrated with your personal calendar
- **📰 Multi-Source News** - Real-time news with scrolling animations
- **🖼️ Photo Slideshow** - Grayscale photos with zoom effects
- **💬 Motivational Messages** - Time-based compliments with glowing effects
- **🎨 Black & White Theme** - Professional monochrome design with glassmorphism

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- Git
- Internet connection

### Installation
```bash
git clone https://github.com/Raghunani12/Magic_Mirror_test_final.git
cd Magic_Mirror_test_final
npm run install-mm
npm run server
```

### Access Your Smart Mirror
- **Local**: http://localhost:8080
- **Network**: http://YOUR_IP_ADDRESS:8080
- **Mobile**: Same URL works on mobile devices

## 📋 Configuration

### ✅ Google Calendar (Already Configured)
- **Your Calendar**: raghunani1437@gmail.com
- **Update Interval**: 5 minutes
- **Display**: Shows next 8 upcoming events

### 📸 Adding Photos
1. Add photos to the `photos/` directory
2. **Supported formats**: JPG, JPEG, PNG, GIF, BMP
3. **Effects**: Automatic grayscale with zoom animations
4. **Timing**: Changes every 12 seconds

### 🌍 Weather & Location (Auto-Configured)
- **Location**: Automatic via IP geolocation
- **Provider**: OpenMeteo (no API key required)
- **Update**: Every 10 minutes

### 📰 News Sources (Pre-Configured)
- BBC News, Reuters, CNN, TechCrunch
- **Update**: Every 5 minutes with scrolling animations

## 🎨 Black & White Animated Design

### Layout Positions
- **Top Left**: Animated Clock + Your Google Calendar
- **Top Center**: Location Display
- **Top Right**: Weather modules
- **Bottom Left**: Photo Slideshow (grayscale with zoom)
- **Bottom Bar**: Scrolling News Feed
- **Lower Third**: Glowing Compliments

### Animation Features
- **Background**: Subtle radial gradient pulse (30s cycle)
- **Clock**: Gentle pulsing effect (2s cycle)
- **Weather Icons**: Floating animation (3s cycle)
- **Temperature**: Pulse scaling (4s cycle)
- **Text**: Glowing effects on headers and compliments
- **Photos**: Grayscale filter with zoom animation
- **News**: Horizontal scrolling text
- **Modules**: Slide-in animations on load

## 📁 Key Files

- `config/config.js` - Your custom smart mirror configuration
- `css/custom.css` - Professional black & white animated theme
- `photos/` - Directory for your photo slideshow
- `SMART_MIRROR_README.md` - Detailed documentation

## 🛠️ Customization

### Changing News Sources
Edit the `newsfeed` module in `config/config.js`:
```javascript
feeds: [
    {
        title: "Your News Source",
        url: "https://your-rss-feed-url.xml"
    }
]
```

### Adjusting Animation Speeds
Edit `css/custom.css` and modify the animation durations:
- Background pulse: `animation: backgroundPulse 30s`
- Clock pulse: `animation: clockPulse 2s`
- Photo zoom: `animation: imageZoom 12s`

### Adding More Calendar Sources
Add additional calendars in `config/config.js`:
```javascript
calendars: [
    {
        url: "https://calendar.google.com/calendar/ical/your-calendar-url",
        name: "Additional Calendar"
    }
]
```

## 🔧 Troubleshooting

### Common Issues
1. **Black Screen**: Check console for errors (F12)
2. **Calendar Not Loading**: Verify iCal URL is accessible
3. **Weather Not Working**: Check internet connection
4. **Photos Not Displaying**: Ensure photos are in `photos/` directory

### Performance Tips
- Resize large images before adding to `photos/`
- Use compressed image formats (JPEG)
- Limit total number of photos for smooth transitions

## 📱 Mobile & Remote Access

Access from any device on your network:
- Find your computer's IP address
- Use `http://YOUR_IP_ADDRESS:8080`
- Works on phones, tablets, and other computers

## 🎯 Next Steps

1. **Add Your Photos**: Place personal photos in `photos/` directory
2. **Customize Layout**: Move modules to different positions
3. **Deploy to Raspberry Pi**: For actual mirror display
4. **Add More Modules**: Explore MagicMirror² module repository

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review `SMART_MIRROR_README.md` for detailed documentation
3. Visit [MagicMirror² Documentation](https://docs.magicmirror.builders/)
4. Check [MagicMirror² Forum](https://forum.magicmirror.builders/)

---

**Built with ❤️ using MagicMirror² | Customized for Professional Smart Mirror Display**
