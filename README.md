# Tags for Markdown: Enhanced Styled Labels for Obsidian

Add visual flair to your Markdown documents with custom tag styles! **Tags for Markdown** lets you highlight and style labels within Markdown documents using simple syntax and customizable colors—all within Obsidian. If you like **Tags for Markdown**, get our extension for [Visual Studio Code](https://github.com/binarynoir/vscode-markdown-tags/)!

[![Support me on Buy Me a Coffee](https://img.shields.io/badge/Support%20me-Buy%20Me%20a%20Coffee-orange?style=for-the-badge&logo=buy-me-a-coffee)](https://buymeacoffee.com/binarynoir)
[![Support me on Ko-fi](https://img.shields.io/badge/Support%20me-Ko--fi-blue?style=for-the-badge&logo=ko-fi)](https://ko-fi.com/binarynoir)
[![Visit my website](https://img.shields.io/badge/Website-binarynoir.tech-8c8c8c?style=for-the-badge)](https://binarynoir.tech)

![obsidian-markdown-tags](./screenshot.png)

## Features

### ✨ Simple Syntax

Transform any text into styled badges:

```markdown
((badge/content))
((badge/content/style-class))
```

### 🎨 CSS-Based Styling  

Everything becomes CSS classes for unlimited customization:
- `((badge/my task))` → `.bn-badge.my-task`
- `((badge/urgent/warning))` → `.bn-badge.urgent.warning`

### 🌈 Built-in Semantic Colors

Five ready-to-use colors: `success`, `warning`, `error`, `info`, `accent`

---

## Getting Started

1. **Install** the plugin from the Obsidian Community Plugins.
2. **Enable** the plugin in the Obsidian settings.
3. **Add Tags** in your Markdown files using the syntax below.

### Quick Examples

```markdown
((badge/todo))                    <!-- Basic badge -->
((badge/urgent/warning))          <!-- With built-in style -->
((badge/my project/custom))       <!-- With custom style class -->
```

---

## How It Works

The plugin transforms `((badge/content/style))` into `<span class="bn-badge content style">content</span>`.

**Built-in Colors**: `success` (green), `warning` (orange), `error` (red), `info` (blue), `accent` (theme color)

**Everything else is CSS classes** - add your own styling for any custom style names.

## CSS Customization

Add custom styling for any content or style name:

```css
/* Style specific content */
.bn-badge.urgent { 
    background-color: #dc2626; 
    animation: pulse 2s infinite; 
}

.bn-badge.completed { 
    background-color: #16a34a; 
    text-decoration: line-through; 
}

/* Style custom style classes */  
.bn-badge.priority {
    background-color: #f59e0b;
    font-weight: bold;
}

.bn-badge.critical {
    background-color: #dc2626;
    color: white;
    border: 2px solid #991b1b;
}

/* Arrow-style example */
.bn-badge.arrow {
    position: relative;
    margin-left: 15px;
    border-radius: 0 4px 4px 0;
}

.bn-badge.arrow:before {
    content: "";
    position: absolute;
    left: -8px;
    width: 0; height: 0;
    border: 10px solid transparent;
    border-right-color: var(--color-l-gray-80);
}
```

**Usage:**
- `((badge/urgent task/urgent))` → `.bn-badge.urgent-task.urgent`
- `((badge/done/completed))` → `.bn-badge.done.completed`  
- `((badge/next/arrow))` → `.bn-badge.next.arrow`

Text is sanitized: spaces→hyphens, special chars removed.


---

## How to install the plugin

- Download the [Latest release](https://github.com/binarynoir/obsidian-markdown-tags/releases/latest)
- Extract the `obsidian-markdown-tags` folder from the zip to your vault `<vault>/.obsidian/plugins/`

### Manually installing the plugin

Copy over main.js, styles.css, manifest.json to your vault VaultFolder/.obsidian/plugins/obsidian-markdown-tags/.

---

## Contributing

> Feel free to submit issues, feature requests, or contribute code on GitHub.

### Development

```bash
npm install
npm run build
cp main.js manifest.json /path/to/your/vault/.obsidian/plugins/obsidian-markdown-tags
```

### Release

### Releasing new releases

- Update the changelog with new features and fixes
- Commit all changed files and create a pull request
- Update the `manifest.json` with the new version number, such as `1.0.1`, and the minimum Obsidian version required for your latest release.
- Update the `versions.json` file with `"new-plugin-version": "minimum-obsidian-version"` so older versions of Obsidian can download an older version of your plugin that's compatible.
- Create new GitHub release using the new version number as the "Tag version". Use the exact version number, don't include a prefix `v`. See here for an example: https://github.com/obsidianmd/obsidian-sample-plugin/releases
- Upload the files `manifest.json`, `main.js`, `styles.css` as binary attachments. Note: The manifest.json file must be in two places, first the root path of your repository and also in the release.
- Publish the release.

> You can simplify the version bump process by running `npm version patch`, `npm version minor` or `npm version major` after updating `minAppVersion` manually in `manifest.json`.
> The command will bump version in `manifest.json` and `package.json`, and add the entry for the new version to `versions.json`

```bash
git checkout main
git pull
git tag -a x.y.z -m "x.y.z"
git push --tags
```

The release will automatically be drafted.

## License

MIT License

---

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

## Author

John Smith III

## Acknowledgments

Thanks to all contributors and users for their support and feedback.
