# @stackla/widget-utils

> 🎨 A comprehensive TypeScript utility library for building powerful User-Generated Content (UGC) widgets.

[![npm version](https://img.shields.io/npm/v/@stackla/widget-utils.svg)](https://www.npmjs.com/package/@stackla/widget-utils)

## 🚀 Overview

`@stackla/widget-utils` is a feature-rich library that provides everything you need to build, customize, and deploy UGC widgets. Whether you're creating a simple content gallery or a complex interactive widget with carousels, infinite scrolling, and dynamic templates, this library has you covered.

## ✨ Features

- **🎯 TypeScript First** - Fully typed API for excellent IDE support and type safety
- **🎨 Flexible Templating** - Support for Handlebars templates with custom helpers
- **⚛️ JSX Support** - Build widgets using JSX syntax without React
- **🎪 Widget Loading** - Automated widget initialization and lifecycle management
- **🔄 Infinite Scrolling** - Built-in hooks for seamless content loading
- **📦 Modular Architecture** - Import only what you need with tree-shakeable exports
- **🎠 Extension Support** - Includes Swiper carousel integration out of the box
- **🎨 CSS Variables** - Dynamic theming and styling support
- **📡 Event System** - Comprehensive event handling for widget interactions
- **🔌 Embed Utilities** - Easy widget embedding for both v2 and v3 widgets

## 📦 Installation

```bash
npm install @stackla/widget-utils
```

```bash
yarn add @stackla/widget-utils
```

```bash
pnpm add @stackla/widget-utils
```

## 🎯 Quick Start

### Basic Widget Setup

```typescript
import { loadWidget } from "@stackla/widget-utils"

// Initialize a widget with default settings
const sdk = await loadWidget({
  features: {
    showTitle: true,
    preloadImages: true,
    addNewTilesAutomatically: true
  }
})
```

### Using JSX for Widget Components

```typescript
import { jsx } from '@stackla/widget-utils/jsx';

const TileComponent = ({ title, image }) => (
  <div className="tile">
    <img src={image} alt={title} />
    <h3>{title}</h3>
  </div>
);
```

## 📚 Module Reference

### Core Modules

#### `@stackla/widget-utils` (Main Export)

The primary entry point providing widget loading, core types, events, and library utilities.

**Key Exports:**

- `loadWidget()` - Initialize and configure widgets
- `ISdk` - TypeScript interface for widget SDK
- Widget lifecycle hooks and event handlers

#### `@stackla/widget-utils/types`

Comprehensive TypeScript type definitions for widgets, tiles, components, and services.

**Includes:**

- `Widget`, `Tile`, `Placement` - Core data types
- `WidgetOptions`, `WidgetSettings` - Configuration types
- Service interfaces for tiles, events, and widgets
- Component types for static content, products, and UGC

#### `@stackla/widget-utils/jsx`

JSX-to-HTML runtime that lets you write components using JSX syntax without React.

**Features:**

- Lightweight JSX transformation
- Event handler support
- Ref support for DOM access
- Type-safe JSX elements

#### `@stackla/widget-utils/handlebars`

Handlebars template engine with custom helpers designed for widget rendering.

**Custom Helpers:**

- `{{tile}}` - Render tile components
- `{{ifEquals}}` - Conditional rendering
- `{{lazy}}` - Lazy loading support
- `{{join}}` - Array joining
- `{{ifAutoPlayVideo}}` - Video autoplay detection
- `{{ifHasProductTags}}` - Product tag checking
- `{{ifHasPublicTags}}` - Public tag checking
- `{{tagFallbackUsername}}` - Username fallback logic

#### `@stackla/widget-utils/libs`

Core library utilities for widget features and functionality.

**Includes:**

- CSS variable management
- Widget feature toggles
- Layout utilities
- Tile manipulation helpers

#### `@stackla/widget-utils/components`

Pre-built component utilities for common widget patterns.

**Available Components:**

- Static content components
- Product display components
- Share menu components
- Add-to-cart components
- UGC tile components

#### `@stackla/widget-utils/extensions`

Widget extensions for enhanced functionality.

**Current Extensions:**

- **Swiper** - Carousel/slider integration

#### `@stackla/widget-utils/extensions/swiper`

Full Swiper carousel integration for creating image/content sliders.

**Features:**

- Automatic initialization
- Responsive configuration
- Touch/swipe support
- Navigation and pagination

#### `@stackla/widget-utils/events`

Event system for widget lifecycle and user interactions.

**Event Types:**

- Widget initialization events
- Tile interaction events
- Load more events
- User action events

#### `@stackla/widget-utils/embed`

Utilities for embedding widgets into web pages.

**Features:**

- Support for v2 and v3 widgets
- Environment configuration (staging/production)
- Auto-detection of widget version
- Shadow DOM support

#### `@stackla/widget-utils/templates`

Template utilities and pre-built templates.

#### `@stackla/widget-utils/bundle`

Bundled distribution for direct browser usage.

## 🔧 Configuration

### Widget Settings

```typescript
interface WidgetSettings {
  features?: {
    showTitle?: boolean // Display widget title
    preloadImages?: boolean // Preload images for performance
    disableWidgetIfNotEnabled?: boolean // Auto-disable on config
    addNewTilesAutomatically?: boolean // Auto-add new tiles
    handleLoadMore?: boolean // Enable load more functionality
    hideBrokenImages?: boolean // Hide broken image tiles
    loadTileContent?: boolean // Load tile content dynamically
    loadTimephrase?: boolean // Load time phrases
  }
  callbacks?: {
    // Custom callback functions
  }
  templates?: {
    // Custom templates
  }
  config?: {
    // Additional configuration
  }
}
```

## 🎨 Examples

### Creating a Gallery Widget

```typescript
import { loadWidget } from "@stackla/widget-utils"
import { renderTilesWithTemplate } from "@stackla/widget-utils/handlebars"

const sdk = await loadWidget({
  features: {
    preloadImages: true,
    hideBrokenImages: true
  }
})

const tiles = await sdk.getTiles()
const html = await renderTilesWithTemplate(tileTemplate, tiles, {
  wid: "your-widget-id"
})
```

### Using Swiper Extension

```typescript
import { initSwiper } from "@stackla/widget-utils/extensions/swiper"

const swiper = initSwiper(".swiper-container", {
  slidesPerView: 3,
  spaceBetween: 30,
  navigation: true,
  pagination: {
    clickable: true
  }
})
```

### Embedding a Widget

```typescript
import { embed } from "@stackla/widget-utils/embed"

await embed({
  widgetId: "your-widget-id",
  root: document.getElementById("widget-container"),
  environment: "production",
  dataProperties: {
    // Custom data attributes
  }
})
```

## 🏗️ Project Structure

```
src/
├── constants.ts           # Global constants
├── embed/                 # Widget embedding utilities
├── events/                # Event system
├── fonts.ts              # Font loading utilities
├── handlebars/           # Handlebars templates and helpers
├── hooks/                # React hooks
├── index.ts              # Main entry point
├── libs/                 # Core library utilities
│   ├── components/       # Component utilities
│   ├── css-variables.ts  # CSS variable management
│   ├── extensions/       # Widget extensions
│   ├── jsx-html.ts       # JSX runtime
│   ├── tile.lib.ts       # Tile utilities
│   ├── widget.features.ts # Widget features
│   ├── widget.layout.ts   # Layout utilities
│   └── widget.utils.ts    # Widget utilities
├── styles/               # Style utilities
├── types/                # TypeScript type definitions
│   ├── components/       # Component types
│   ├── core/            # Core types
│   ├── services/        # Service types
│   └── loader.ts        # Loader types
└── widget-loader.ts      # Widget loader implementation
```

## 🧪 Development

### Running Tests

```bash
npm test
```

### Building

```bash
npm run build
```

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npm run typecheck
```

## 📝 Contributing

Contributions are welcome! Please ensure your code:

- Passes all tests (`npm test`)
- Follows the linting rules (`npm run lint`)
- Includes proper TypeScript types
- Is documented with JSDoc comments where appropriate

## 🔗 Links

- [NPM Package](https://www.npmjs.com/package/@stackla/widget-utils)
- [Repository](https://github.com/Stackla/widget-utils)
- [Changelog](./CHANGELOG.md)

## 🎯 Use Cases

- **Social Media Galleries** - Display Instagram, Twitter, and other social feeds
- **Product Showcases** - Feature user-generated product reviews and photos
- **Event Coverage** - Aggregate and display event content from multiple sources
- **Community Walls** - Create interactive community content displays
- **Marketing Campaigns** - Build engaging campaign landing pages with UGC

---

Built with ❤️ by Nosto
