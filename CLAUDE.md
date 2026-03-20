# WRM Dev

Static GitHub Pages site for domain experts to validate SFM (Standard Format Markers) lexicon files via drag-and-drop.

## Architecture

Two-pane layout: left pane renders view output, right pane has view navigation buttons and a file drop zone.

### File structure
- `index.html` — Shell HTML, loads only `css/style.css` and `js/interface.js`
- `css/style.css` — All styles
- `js/interface.js` — Core logic: view registry, button generation, drag-and-drop, scroll preservation
- `js/view-*.js` — View plugins, one per file

### View plugin system
- Views are registered in `js/interface.js`: `views = {"Display Name": "js/view-foo.js"}`
- Each view JS file calls `window.registerView("js/view-foo.js", function(content, targetDiv) { ... })`
- View scripts are dynamically loaded from the `views` config — no manual script tags needed
- The render function receives file content (string) and a target div, and populates it synchronously

### Adding a new view
1. Create `js/view-foo.js` with a `registerView` call
2. Add an entry to the `views` object in `js/interface.js`

## File format

Input files are SFM lexicon files. Lines are `\key value` pairs. `\lx` marks lexical entries. Example:
```
\lx -karn
   \sd G.1
      \ge *now
\lx ajjimpi
      \va wattimpi
```

## Conventions
- No build tools, no frameworks — vanilla HTML/CSS/JS only
- All JS in `js/`, all CSS in `css/`
- Interface logic in `js/interface.js`, view logic in `js/view-*.js`
- Handle cross-platform line endings: `content.split(/\r\n|\r|\n/)`
- Escape user file content before inserting into DOM (XSS prevention)
