# Tags for Markdown: Enhanced Styled Labels for Obsidian

Add visual flair to your Markdown documents with custom tag styles! **Tags for Markdown** lets you highlight and style labels within Markdown documents using simple syntax, customizable colors, and optional arrow indicators—all within Obsidian. If you like **Tags for Markdown**, get our extension for [Visual Studio Code](https://github.com/binarynoir/vscode-markdown-tags/)!

[![Support me on Buy Me a Coffee](https://img.shields.io/badge/Support%20me-Buy%20Me%20a%20Coffee-orange?style=for-the-badge&logo=buy-me-a-coffee)](https://buymeacoffee.com/binarynoir)
[![Support me on Ko-fi](https://img.shields.io/badge/Support%20me-Ko--fi-blue?style=for-the-badge&logo=ko-fi)](https://ko-fi.com/binarynoir)
[![Visit my website](https://img.shields.io/badge/Website-binarynoir.tech-8c8c8c?style=for-the-badge)](https://binarynoir.tech)

![obsidian-markdown-tags](./screenshot.png)

## Features

### 🎨 Styled Tags

Highlight and style tags with ease using predefined or custom styles.

### 🖌️ Customizable Colors

Use predefined colors or specify custom hex codes for both background and foreground colors, enabling unlimited styling options.

### 📄 Flexible Syntax


Simple, flexible syntax options:

You can use either the `|` (pipe) or `/` (slash) character as a separator between tag components:

```markdown
((tag|label))
((tag/label))
((tag|label|background-color))
((tag/label/background-color))
((tag|label|background-color|foreground-color))
((tag/label/background-color/foreground-color))
((<tag|label)) <!-- Adds an arrow to the left -->
((<tag/label)) <!-- Adds an arrow to the left -->
```

> **Note:** Both `|` and `/` are supported as separators. Use whichever you prefer or fits your workflow. This is especially useful when using tags within markdown tables.

### 🌈 Supports a Variety of Colors

Choose from predefined colors (`grey`, `green`, `orange`, etc.) or use custom hex codes to suit your design preferences.

---

## Getting Started

1. **Install** the plugin from the Obsidian Community Plugins.
2. **Enable** the plugin in the Obsidian settings.
3. **Add Tags** in your Markdown files using the syntax below.

### Basic Syntax Examples

#### Status Tags

```markdown
((tag|todo)) ((tag|in-progress|#ffcc00)) ((tag|done|#28a745|#ffffff))
```

#### Arrowed Tags

```markdown
((<tag|planned)) ((<tag|custom test))
```

#### Customizing Colors

```markdown
((tag|background|#ff4500)) ((tag|foreground||#ff6347)) ((tag|both colors|#32cd32|#ffffff))
```

---

## Tags and Colors

**Any label is now supported!** The plugin automatically converts your label into a CSS class name, allowing unlimited customization. Common legacy tags like **todo**, **planned**, **in-progress**, **doing**, **done**, **tip**, **on-hold**, **tbd**, **proposed**, **draft**, **wip**, **mvp**, **blocked**, **canceled**, **error**, **warning**, **warn** still work with predefined styling.

For each tag, the following colors are available: **grey**, **green**, **yellow**, **orange**, **blue**, **purple**, **red**.

See Examples Markdown Documents

### Tag Examples

#### Custom Labels (Any Text Supported)

- `((tag|My Custom Task|grey))`
- `((tag|Project Alpha|green))`
- `((tag|Bug Fix|red))`
- `((tag|Code Review|blue))`
- `((tag|Design Phase|purple))`

#### Legacy Tags (Predefined Styling)

- `((tag|todo|grey))` - Traditional task tag
- `((tag|in-progress|orange))` - Work in progress
- `((tag|done|green))` - Completed task
- `((tag|blocked|red))` - Blocked task

#### Color Examples (Any Label + Any Color)

- `((tag|YOUR_LABEL|grey))`
- `((tag|YOUR_LABEL|green))`
- `((tag|YOUR_LABEL|yellow))`
- `((tag|YOUR_LABEL|orange))`
- `((tag|YOUR_LABEL|blue))`
- `((tag|YOUR_LABEL|purple))`
- `((tag|YOUR_LABEL|red))`

> Replace `YOUR_LABEL` with any text you want. Special characters will be automatically converted to valid CSS class names.

---

### With Arrow (using `((<tag|label|bgcolor))`)

#### Custom Arrow Labels

- `((<tag|Custom Arrow|grey))`
- `((<tag|Review Phase|orange))`
- `((<tag|Implementation|red))`
- `((<tag|Testing Phase|blue))`
- `((<tag|Deployment|green))`

> Arrow tags work with any label, just like regular tags!

---

## Advanced Options

### CSS Integration

Since any label now becomes a CSS class, you can create custom styles for your specific labels. For example:

```css
/* Custom styling for specific labels */
.bn-tags.my-project {
    background-color: #ff6b35;
    border: 2px solid #ff4500;
}

.bn-tags.high-priority {
    background-color: #dc143c;
    font-weight: bold;
    animation: pulse 1s infinite;
}
```

Labels are automatically sanitized to valid CSS class names (spaces become hyphens, special characters are removed).

### Error Handling

The plugin defaults to `grey` when invalid colors are detected to ensure a consistent and polished look.

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
