# Professional Smart Mirror - Black & White Animated Theme

A sleek, modern smart mirror solution built with MagicMirror² featuring your personal Google Calendar, weather, news, photos, and location detection with stunning black and white animations.

## 🌟 Features

- **⏰ Animated Clock & Date** - Large, pulsing clock with smooth animations and full date information
- **🌤️ Weather with Animations** - Current weather and 5-day forecast with floating icons and temperature pulse effects
- **📍 IP Geolocation** - Automatically detects and displays your current city and country
- **📅 Your Google Calendar** - Integrated with your personal calendar: `raghunani1437@gmail.com`
- **📰 Multi-Source News** - Real-time news from BBC, Reuters, CNN, and TechCrunch with scrolling animations
- **🖼️ Photo Slideshow** - Grayscale photo slideshow with zoom effects and smooth transitions
- **💬 Motivational Messages** - Time-based compliments with glowing text effects
- **🎨 Black & White Theme** - Professional monochrome design with subtle animations and glassmorphism effects

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- Git
- Internet connection

### Installation & Setup

1. **Clone and Install** (Already completed)
   ```bash
   git clone https://github.com/MagicMirrorOrg/MagicMirror.git
   cd MagicMirror
   npm run install-mm
   ```

2. **Start the Server**
   ```bash
   npm run server
   ```

3. **Access Your Smart Mirror**
   - Open your browser and go to: `http://localhost:8080`
   - Or from another device: `http://YOUR_IP_ADDRESS:8080`

## 📋 Configuration

### ✅ Google Calendar Setup (Already Configured)
Your personal calendar is integrated and ready:
- **Calendar URL**: `https://calendar.google.com/calendar/ical/raghunani1437%40gmail.com/public/basic.ics`
- **Update Interval**: 5 minutes
- **Display**: Shows next 8 upcoming events
- **Features**: Time-based display with smooth animations

### 📸 Adding Photos
1. Add your photos to the `photos/` directory
2. **Supported formats**: JPG, JPEG, PNG, GIF, BMP
3. **Recommended size**: 1920x1080 or smaller for best performance
4. **Effects**: Photos are automatically converted to grayscale with zoom animations
5. **Timing**: Changes every 12 seconds with smooth transitions

### 🌍 Weather & Location (Auto-Configured)
- **Location Detection**: Automatic via IP geolocation
- **Weather Provider**: OpenMeteo (no API key required)
- **Update Interval**: 10 minutes
- **Display**: Current weather + 5-day forecast with animations

### 📰 News Sources (Pre-Configured)
- **BBC News**: International news
- **Reuters**: Business and world news
- **CNN**: Breaking news
- **TechCrunch**: Technology news
- **Update**: Every 5 minutes with scrolling animations

## 🎨 Black & White Animated Design

### 🎭 Layout Positions
- **Top Left**: Animated Clock + Your Google Calendar (slide-in from left)
- **Top Center**: Location Display (slide-in from top)
- **Top Right**: Weather modules (slide-in from right)
- **Bottom Left**: Photo Slideshow (grayscale with zoom effects)
- **Bottom Bar**: Scrolling News Feed
- **Lower Third**: Glowing Compliments

### ✨ Animation Features
- **Background**: Subtle radial gradient pulse (30s cycle)
- **Clock**: Gentle pulsing effect (2s cycle)
- **Weather Icons**: Floating animation (3s cycle)
- **Temperature**: Pulse scaling (4s cycle)
- **Text**: Glowing effects on headers and compliments
- **Photos**: Grayscale filter with zoom animation (12s cycle)
- **News**: Horizontal scrolling text (30s cycle)
- **Modules**: Slide-in animations on load

### 🎨 Theme Characteristics
- **Color Scheme**: Pure black background with white text
- **Typography**: Roboto font family with various weights
- **Effects**: Glassmorphism, backdrop blur, subtle shadows
- **Responsiveness**: Adapts to different screen sizes
- **Accessibility**: Focus states and print-friendly styles

## 🔧 Advanced Configuration

### News Sources
Current sources: BBC, Reuters, CNN
To add more sources, edit the `newsfeed` module in `config/config.js`

### Update Intervals
- Calendar: 5 minutes
- Weather: 10 minutes
- News: 5 minutes
- Photos: 10 seconds per image

### Module Positions
Available positions:
- `top_bar`, `top_left`, `top_center`, `top_right`
- `upper_third`, `middle_center`, `lower_third`
- `bottom_left`, `bottom_center`, `bottom_right`, `bottom_bar`

## 🛠️ Troubleshooting

### Common Issues

1. **Black Screen**
   - Check console for errors (F12)
   - Verify all modules are properly installed
   - Check network connectivity

2. **Calendar Not Loading**
   - Verify the iCal URL is accessible
   - Check if the calendar is set to public
   - Ensure proper URL encoding

3. **Weather Not Working**
   - Check internet connection
   - Verify IP geolocation is working
   - Try setting manual coordinates

4. **Photos Not Displaying**
   - Ensure photos are in the `photos/` directory
   - Check file formats are supported
   - Verify file permissions

### Performance Optimization

1. **Image Optimization**
   - Resize large images before adding
   - Use compressed formats (JPEG for photos)
   - Limit total number of images

2. **Network Optimization**
   - Use local network for better performance
   - Consider caching for news feeds
   - Optimize update intervals

## 📱 Mobile & Remote Access

The mirror is configured to accept connections from any IP address. Access from:
- **Local**: `http://localhost:8080`
- **Network**: `http://YOUR_IP_ADDRESS:8080`
- **Mobile**: Same network URL on mobile browser

## 🔒 Security Notes

- Currently configured for local network access
- For internet access, consider:
  - Setting up proper authentication
  - Using HTTPS
  - Configuring firewall rules
  - Limiting IP whitelist

## 📚 Additional Resources

- [MagicMirror² Documentation](https://docs.magicmirror.builders/)
- [Module Repository](https://modules.magicmirror.builders/)
- [Community Forum](https://forum.magicmirror.builders/)
- [GitHub Repository](https://github.com/MagicMirrorOrg/MagicMirror)

## 🎯 Next Steps

1. **Add Your Photos**: Place personal photos in the `photos/` directory
2. **Customize News**: Edit news sources in the configuration
3. **Adjust Layout**: Move modules to different positions as needed
4. **Add Modules**: Explore additional modules from the community
5. **Hardware Setup**: Deploy to Raspberry Pi for actual mirror display

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review MagicMirror² documentation
3. Visit the community forum
4. Check GitHub issues

---

**Enjoy your professional smart mirror! 🪞✨**
