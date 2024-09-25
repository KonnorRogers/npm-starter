---
title: Getting Started
permalink: /guides/getting-started/
---

## NPM Installation

```bash
npm install {{ packageName }}
```

## NPM Usage

```js
// entrypoint.js
import "{{ packageName }}";
```

## CDN usage

```html
<script type="module">
  import "https://cdn.jsdelivr.net/npm/{{ packageName }}";

  // Loading a version range. This will load the latest >= 1.0.0 and < 2.0.0 of {{ packageName }}.
  import "https://cdn.jsdelivr.net/npm/{{ packageName }}@^1.0.0";

  // Loading a specific version. This will only load v1.0.0
  import "https://cdn.jsdelivr.net/npm/{{ packageName }}@1.0.0";
</script>
```

## A basic example

