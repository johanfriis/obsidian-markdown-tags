const { Plugin } = require('obsidian');
const { EditorView, Decoration, DecorationSet, ViewPlugin, ViewUpdate } = require('@codemirror/view');
const { RangeSetBuilder } = require('@codemirror/state');

// Convert any text to valid CSS class name (spaces->hyphens, remove special chars)
const sanitizeForCSS = (text) => {
	return text.toLowerCase()
		.replace(/[^a-z0-9-_]/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '');
};

// Badge syntax pattern with named groups for content and optional style
const BADGE_REGEX = /\(\(badge\/(?<content>[^\/\)]+)(?:\/(?<style>[^\/\)]*))?\)\)/;

// Prevent XSS by escaping HTML entities for innerHTML insertion
const escapeHtml = (str) => str.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char] || char));

// Create CodeMirror decoration with CSS classes for badge styling
function generateBadgeDecoration(content, style) {
	const contentClass = sanitizeForCSS(content);
	const styleClass = style ? sanitizeForCSS(style) : '';
	const combinedClasses = `bn-badge ${contentClass} ${styleClass}`.trim();

	return Decoration.mark({
		class: combinedClasses
	});
}

class BadgePlugin extends Plugin {
	async onload() {
		this.registerEditorExtension(this.editModeBadgeHighlighter());
		this.registerMarkdownPostProcessor(this.viewModeBadgeHighlighter());
	}

	// Handle badge styling in edit mode using CodeMirror decorations
	editModeBadgeHighlighter() {
		return ViewPlugin.fromClass(class {
			constructor(view) {
				this.decorations = this.buildDecorations(view);
			}

			update(update) {
				if (update.docChanged || update.viewportChanged || update.selectionSet) {
					this.decorations = this.buildDecorations(update.view);
				}
			}

			buildDecorations(view) {
				const builder = new RangeSetBuilder();
				const cursorPos = view.state.selection.main.head;

				// Build code block map once for entire visible range
				const codeBlockRanges = this.getCodeBlockRanges(view);

				for (const { from, to } of view.visibleRanges) {
					const text = view.state.doc.sliceString(from, to);
					const badgeRegex = new RegExp(BADGE_REGEX, 'g');
					let match;

					while ((match = badgeRegex.exec(text)) !== null) {
						const start = from + match.index;
						const end = start + match[0].length;

						// Skip if cursor is editing this badge or badge is in code block
						if ((cursorPos >= start && cursorPos <= end) || this.isInCodeBlock(start, codeBlockRanges)) {
							continue;
						}

						const { content = '', style = '' } = match.groups || {};
						const escapedContent = escapeHtml(content);
						// Cache the content position calculation
						const contentStart = start + match[0].indexOf(content);
						const contentEnd = contentStart + content.length;

						builder.add(start, contentStart, Decoration.mark({ class: "bn-hidden" }));
						builder.add(contentStart, contentEnd, generateBadgeDecoration(escapedContent, style));
						builder.add(contentEnd, end, Decoration.mark({ class: "bn-hidden" }));
					}
				}

				return builder.finish();
			}

			// Build code block ranges once per update - much more efficient
			getCodeBlockRanges(view) {
				const ranges = [];
				let inCodeBlock = false;
				let blockStart = 0;

				for (let i = 1; i <= view.state.doc.lines; i++) {
					const line = view.state.doc.line(i);
					if (line.text.trim().startsWith("```")) {
						if (inCodeBlock) {
							ranges.push({ start: blockStart, end: line.to });
							inCodeBlock = false;
						} else {
							blockStart = line.from;
							inCodeBlock = true;
						}
					}
				}

				return ranges;
			}

			isInCodeBlock(pos, codeBlockRanges) {
				return codeBlockRanges.some(range => pos >= range.start && pos <= range.end);
			}
		}, { decorations: v => v.decorations });
	}

	// Handle badge styling in reading view by processing HTML content
	viewModeBadgeHighlighter() {
		return (el, ctx) => {
			// Quick check to avoid processing elements without badge syntax
			if (!el.textContent || !el.textContent.includes('((badge/')) {
				return;
			}

			const elements = Array.from(el.querySelectorAll("p, li, span, div, td, th"));

			elements.forEach(element => {
				const originalText = element.textContent;
				if (!originalText || !originalText.includes('((badge/')) return;

				let updatedHTML = element.innerHTML;
				const badgeRegex = new RegExp(BADGE_REGEX, 'g');

				// Use replace with callback for better performance
				updatedHTML = updatedHTML.replace(badgeRegex, (match, ...args) => {
					// Extract named groups from the match
					const groups = args[args.length - 1];
					const { content = "", style = "" } = groups;

					const escapedContent = escapeHtml(content);
					const decoration = generateBadgeDecoration(escapedContent, style);
					return `<span class="${decoration.spec.class}">${escapedContent}</span>`;
				});

				element.innerHTML = updatedHTML;
			});
		};
	}
}

module.exports = BadgePlugin;
