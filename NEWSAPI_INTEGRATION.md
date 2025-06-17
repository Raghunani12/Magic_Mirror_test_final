# 📰 NewsAPI.org Integration for MagicMirror

## 🎯 Overview

Your MagicMirror now supports **NewsAPI.org** integration alongside traditional RSS feeds. This provides access to real-time news from thousands of sources with advanced filtering and search capabilities.

## 🔧 Implementation Details

### **Custom NewsAPI Fetcher**
- **File**: `modules/default/newsfeed/newsapifetcher.js`
- **Purpose**: Handles JSON responses from NewsAPI.org endpoints
- **Features**: 
  - JSON parsing instead of RSS/XML
  - Source attribution
  - Error handling for API limits
  - Rate limiting compliance

### **Enhanced Node Helper**
- **File**: `modules/default/newsfeed/node_helper.js`
- **Enhancement**: Detects NewsAPI feeds and uses appropriate fetcher
- **Flag**: `isNewsAPI: true` in feed configuration

## 📋 Configuration

### **Current Setup (Tesla News)**
```javascript
{
    module: "newsfeed",
    position: "bottom_bar",
    config: {
        feeds: [
            {
                title: "Tesla News",
                url: "https://newsapi.org/v2/everything?q=tesla&from=2025-05-17&sortBy=publishedAt&apiKey=b77004cb83c64ae4881ce4a66b50603e",
                useCorsProxy: false,
                isNewsAPI: true // Important: Identifies this as NewsAPI feed
            }
        ],
        reloadInterval: 5 * 60 * 1000, // 5 minutes (respects API limits)
        maxNewsItems: 10,
        // ... other config options
    }
}
```

## 🌐 NewsAPI.org Endpoints

### **Your Current Endpoint**
```
https://newsapi.org/v2/everything?q=tesla&from=2025-05-17&sortBy=publishedAt&apiKey=b77004cb83c64ae4881ce4a66b50603e
```

### **Available Parameters**
- `q`: Search query (e.g., "tesla", "technology", "bitcoin")
- `from`: Start date (YYYY-MM-DD format)
- `to`: End date (YYYY-MM-DD format)
- `sortBy`: Sort order (`publishedAt`, `relevancy`, `popularity`)
- `language`: Language code (`en`, `es`, `fr`, etc.)
- `sources`: Specific news sources
- `domains`: Specific domains to include/exclude

### **Example Configurations**

#### **Technology News**
```javascript
{
    title: "Tech News",
    url: "https://newsapi.org/v2/everything?q=technology&sortBy=publishedAt&apiKey=YOUR_API_KEY",
    isNewsAPI: true
}
```

#### **Top Headlines**
```javascript
{
    title: "Breaking News",
    url: "https://newsapi.org/v2/top-headlines?country=us&apiKey=YOUR_API_KEY",
    isNewsAPI: true
}
```

#### **Business News**
```javascript
{
    title: "Business",
    url: "https://newsapi.org/v2/top-headlines?category=business&apiKey=YOUR_API_KEY",
    isNewsAPI: true
}
```

## 🔑 API Key Management

### **Current API Key**
- **Key**: `b77004cb83c64ae4881ce4a66b50603e`
- **Plan**: Check your NewsAPI.org dashboard for limits
- **Rate Limits**: Typically 1000 requests/day for free tier

### **Best Practices**
1. **Environment Variables**: Store API key in environment variable
2. **Rate Limiting**: Use 5+ minute intervals to avoid hitting limits
3. **Caching**: Module automatically caches responses
4. **Error Handling**: Built-in fallback for API failures

## 📊 Data Structure

### **NewsAPI Response Format**
```json
{
    "status": "ok",
    "totalResults": 100,
    "articles": [
        {
            "source": {"name": "TechCrunch"},
            "title": "Tesla announces new...",
            "description": "Tesla has announced...",
            "url": "https://techcrunch.com/...",
            "publishedAt": "2025-06-17T10:30:00Z",
            "content": "Full article content..."
        }
    ]
}
```

### **Converted to MagicMirror Format**
```javascript
{
    title: "Tesla announces new...",
    description: "Tesla has announced...",
    pubdate: "2025-06-17T10:30:00Z",
    url: "https://techcrunch.com/...",
    sourceTitle: "TechCrunch",
    useCorsProxy: false,
    hash: "unique_hash_for_deduplication"
}
```

## 🚀 Benefits

### **Advantages over RSS**
1. **Real-time**: More frequent updates than RSS
2. **Search**: Advanced query capabilities
3. **Filtering**: Date ranges, sources, languages
4. **Metadata**: Rich source information
5. **Reliability**: Professional API with uptime guarantees

### **Grid Layout Integration**
- **Position**: Bottom row (full width)
- **Responsive**: Scales across all devices
- **Animation**: Smooth scrolling ticker
- **Styling**: Matches your dark theme

## 🔧 Troubleshooting

### **Common Issues**
1. **API Limit Exceeded**: Increase `reloadInterval`
2. **No Results**: Check query parameters and date ranges
3. **CORS Errors**: Ensure `useCorsProxy: false` for NewsAPI
4. **Missing Articles**: Verify API key and endpoint

### **Debug Mode**
Enable logging in config:
```javascript
logFeedWarnings: true
```

## 📈 Future Enhancements

### **Possible Additions**
1. **Multiple Sources**: Combine different NewsAPI endpoints
2. **Location-based**: Use geolocation for local news
3. **Category Rotation**: Cycle through different news categories
4. **Sentiment Analysis**: Filter positive/negative news
5. **Image Integration**: Display article thumbnails

## 🔗 Resources

- **NewsAPI.org Documentation**: https://newsapi.org/docs
- **API Key Dashboard**: https://newsapi.org/account
- **Source List**: https://newsapi.org/sources
- **Status Page**: https://status.newsapi.org/
