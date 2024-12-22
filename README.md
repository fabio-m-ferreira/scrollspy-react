# React Scrollspy Component

A lightweight, customizable React component for automatically updating navigation based on scroll position. This modern implementation includes TypeScript support and flexible configuration options.

## Features

- ⚛️ Supports React 19
- 🚀 Written in TypeScript
- 🎯 Automatically highlights navigation items based on scroll position
- ⚡ Performant with throttled scroll handling
- 🎨 Customizable styling and offset
- 📱 Supports both window and custom container scrolling
- 🔄 Optional callback for scroll updates


# Usage

```import Scrollspy from 'your-package-name';

function App() {
  return (
    <div>
      <Scrollspy
        items={['section-1', 'section-2', 'section-3']}
        currentClassName="is-active"
        offset={50}
      >
        <li><a href="#section-1">Section 1</a></li>
        <li><a href="#section-2">Section 2</a></li>
        <li><a href="#section-3">Section 3</a></li>
      </Scrollspy>

      <div id="section-1">Section 1 content</div>
      <div id="section-2">Section 2 content</div>
      <div id="section-3">Section 3 content</div>
    </div>
  );
}```
