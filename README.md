# Croner Document Manager

A React TypeScript document management application using mock data with comprehensive accessibility features, keyboard navigation, virtual scrolling for performance, and 111 tests covering all components and hooks.

## ✨ Features

- **📁 Document Management**: Browse folders and files with intuitive navigation
- **🔍 Smart Search**: Real-time filtering by filename with error handling
- **📊 Flexible Sorting**: Sort by name or date in ascending/descending order
- **📱 Responsive Design**: Works seamlessly on all devices
- **♿ Accessibility First**: Full keyboard navigation and screen reader support
- **⚡ Virtual Scrolling**: Performance-optimized for large document lists
- **🧪 Comprehensive Testing**: Full test coverage with Vitest and React Testing Library

## 🚀 Accessibility & Keyboard Navigation

All functionality is keyboard accessible with comprehensive screen reader support (WCAG 2.1 AA).

### Keyboard Shortcuts:
- **Backspace** - Go back to previous folder
- **↑↓** - Navigate through documents
- **Enter/Space** - Open folders
- **Ctrl+F** - Focus search input
- **Escape** - Clear search
- **Home/End** - Jump to first/last item

📖 **Complete accessibility guide: [KEYBOARD_NAVIGATION.md](./KEYBOARD_NAVIGATION.md)**

## 🛠️ Technical Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Testing**: Vitest + React Testing Library
- **Styling**: CSS with accessibility-first design
- **Performance**: react-window for virtual scrolling
- **Architecture**: Organized component structure with custom hooks

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build
npm run build

# Testing
npm run test          # Watch mode
npm run test:run      # Single run
npm run test:coverage # Coverage report
```

## 🧪 Testing

- **111 tests** across all components and hooks
- **100% test coverage** for core functionality
- **Accessibility testing** with React Testing Library
- **Mock data** for consistent test results

## 📁 Project Structure

```
src/
├── components/          # Organized by component
│   ├── DocumentControls/     # Document sorting and search controls
│   ├── DocumentItem/         # Individual document/folder display
│   ├── DocumentList/         # Document list with virtual scrolling
│   ├── ErrorBoundary/        # Error handling and recovery
│   └── LoadingSpinner/       # Loading state indicator
├── hooks/              # Custom React hooks
│   ├── useDocuments/         # Document management logic
│   ├── useErrorBoundary/     # Error boundary functionality
│   └── useKeyboardNavigation/ # Keyboard navigation handling
├── types/              # TypeScript definitions
├── assets/             # Mock data
└── setupTests.ts       # Test configuration and setup
```
