# atoll-js Showcase Website

Interactive demonstration website for the atoll-js SDK, showcasing all features including live activities, lock screen widgets, and notch experiences for macOS.

## Features

- **Live Activities**: Download progress, pomodoro timer, news marquee, audio spectrum, flight tracker, and progress indicators
- **Lock Screen Widgets**: Inline, card (liquid glass), circular, and custom WebView widgets
- **Notch Experiences**: Simple tab, minimalistic, and combined layouts
- **Real-time Event Log**: Monitor all Atoll events and communication
- **Interactive Code Examples**: View and copy TypeScript code for each demo
- **Professional UI**: Dark theme with macOS aesthetics and smooth animations

## Prerequisites

- **macOS 13.0+** with a notch-equipped Mac
- **Atoll app** installed and running ([Download](https://github.com/Ebullioscopic/Atoll))
- **RPC Server enabled** in Atoll settings (port 9020)

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/Ebullioscopic/atoll-js.git
cd atoll-js/.github/pages
```

2. Serve the website locally:
```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

3. Open `http://localhost:8000` in your browser

4. Ensure Atoll is running with RPC server enabled

## How to Use

1. **Start Atoll**: Launch the Atoll app on your Mac
2. **Enable RPC Server**: Go to Atoll Settings → Developer → Enable "RPC Server" (port 9020)
3. **Open Website**: Navigate to the showcase website
4. **Connect**: The website will automatically connect to Atoll
5. **Authorize**: Click "Request Authorization" to enable demo features
6. **Explore**: Click any demo button to see it in action on your Mac!

## Project Structure

```
.github/pages/
├── index.html          # Main HTML file
├── css/
│   ├── themes.css      # CSS variables and theme
│   ├── main.css        # Main styles
│   └── components.css  # Component styles
├── js/
│   ├── main.js         # Application entry point
│   ├── demo-controller.js    # Demo action handlers
│   ├── ui-manager.js         # UI manipulation
│   ├── event-logger.js       # Event logging
│   └── demo-definitions.js   # Demo configurations
└── README.md           # This file
```

## Technology Stack

- **Vanilla JavaScript/TypeScript**: No framework dependencies
- **atoll-js SDK**: Loaded as ES6 module from parent project
- **Prism.js**: Syntax highlighting for code examples
- **CSS Variables**: Theming and design system
- **ES6 Modules**: Modern JavaScript module system

## Browser Compatibility

- Chrome 100+
- Safari 15+
- Firefox 100+
- Edge 100+

## Deployment

### GitHub Pages

1. Push changes to the repository
2. Go to repository Settings → Pages
3. Set source to `.github/pages` directory
4. Save and wait for deployment

### Manual Deployment

Copy all files from `.github/pages/` to your web server. Ensure the atoll-js dist files are accessible at `../../../dist/` relative to the pages directory.

## Troubleshooting

### Connection Failed
- Ensure Atoll is running
- Check that RPC server is enabled in Atoll settings
- Verify port 9020 is not blocked by firewall
- Refresh the webpage

### Authorization Denied
- Check Atoll settings and authorize the website
- Try disconnecting and reconnecting
- Restart Atoll if needed

### Demos Not Appearing
- Lock your Mac to see lock screen widgets
- Check that you've clicked "Request Authorization"
- Verify Atoll is in the foreground

## Contributing

Contributions are welcome! Please see the main [atoll-js repository](https://github.com/Ebullioscopic/atoll-js) for contribution guidelines.

## License

MIT License - see [LICENSE](../../LICENSE) for details.

## Links

- [atoll-js GitHub](https://github.com/Ebullioscopic/atoll-js)
- [Atoll GitHub](https://github.com/Ebullioscopic/Atoll)
- [atoll-js Documentation](https://github.com/Ebullioscopic/atoll-js/tree/main/docs)
