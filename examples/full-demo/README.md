# atoll-js Full API Demo

Interactive CLI application that demonstrates all atoll-js features.

## Setup

```bash
cd examples/full-demo
npm install
npm run build
npm start
```

## Requirements

- Atoll running with RPC server enabled (port 9020)
- Node.js 18+

## Usage

The demo presents a numbered menu. Type a number and press Enter:

1. **Connect** to Atoll
2. **Authorize** your app
3. **Present/Update/Dismiss** live activities, widgets, and notch experiences

All server events (dismissals, authorization changes) are logged automatically.

## Features Demonstrated

### Live Activities
- Download progress with percentage indicator
- Pomodoro countdown with trailing timer
- News marquee with scrolling text
- Audio spectrum visualizer
- Flight tracker with text trailing
- Ring and bar progress indicators

### Lock Screen Widgets
- Inline flight widget
- Card widget with liquid glass effect
- Circular gauge widget
- Custom web widget with animated sparkline

### Notch Experiences
- Simple tab with text content
- Minimalistic override with metrics
- Combined tab + minimalistic with system metrics
