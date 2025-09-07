import { Plugin, MarkdownPostProcessorContext } from "obsidian";
import { EditorView, Decoration, DecorationSet, ViewPlugin, ViewUpdate } from "@codemirror/view";
import { RangeSetBuilder } from "@codemirror/state";

// Convert any text to valid CSS class name (spaces->hyphens, remove special chars)
const sanitizeForCSS = (text: string): string => {
	return text.toLowerCase()
		.replace(/[^a-z0-9-_]/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '');
};

// Match ((badge/content/style)) syntax and extract content/style parts
const badgeSyntaxRegex = /\(\(badge\/(?<content>[^\/\)]+)(?:\/(?<style>[^\/\)]*))?\)\)/g;

// Prevent XSS by escaping HTML entities for innerHTML insertion
const escapeHtml = (str: string): string => str.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char] || char));

// Create CodeMirror decoration with CSS classes for badge styling
function generateBadgeDecoration(content: string, style?: string): Decoration {
	const contentClass = sanitizeForCSS(content);
	const styleClass = style ? sanitizeForCSS(style) : '';
	const combinedClasses = `bn-badge ${contentClass} ${styleClass}`.trim();

	// Return the decoration with just CSS classes
	return Decoration.mark({
		class: combinedClasses
	});
}

export default class BadgePlugin extends Plugin {
	async onload() {
		this.registerEditorExtension(this.editModeBadgeHighlighter());
		this.registerMarkdownPostProcessor(this.viewModeBadgeHighlighter());
	}

	// Handle badge styling in edit mode using CodeMirror decorations  
	private editModeBadgeHighlighter() {
		return ViewPlugin.fromClass(class {
			decorations: DecorationSet;

			constructor(view: EditorView) {
				this.decorations = this.buildDecorations(view);
			}

			// Update decorations on document or viewport change
			update(update: ViewUpdate) {
				if (update.docChanged || update.viewportChanged || update.selectionSet) {
					this.decorations = this.buildDecorations(update.view);
				}
			}

			// Build decorations for tag syntax patterns
			buildDecorations(view: EditorView): DecorationSet {
				const builder = new RangeSetBuilder<Decoration>();
				const cursorPos = view.state.selection.main.head;

				for (const { from, to } of view.visibleRanges) {
					const text = view.state.doc.sliceString(from, to);
					let match;

					const isInCodeBlock = (pos: number): boolean => {
						const line = view.state.doc.lineAt(pos);
						let inCodeBlock = false;
						for (let i = 1; i <= view.state.doc.lines; i++) {
							const currentLine = view.state.doc.line(i).text.trim();

							if (currentLine.startsWith("```")) {
								inCodeBlock = !inCodeBlock;
							}
							if (i === line.number) {
								return inCodeBlock;
							}
						}
						return false;
					};

					while ((match = badgeSyntaxRegex.exec(text)) !== null) {
						const start = from + (match.index ?? 0);
						const end = start + match[0].length;

						// Skip if cursor is editing this badge or badge is in code block
						if (cursorPos >= start && cursorPos <= end || (isInCodeBlock(start))) {
							continue;
						}

						const { content = '', style = '' } = match.groups ?? {};
						const escapedContent = escapeHtml(content);
	
						builder.add(start, start + match[0].indexOf(content), Decoration.mark({ class: "bn-hidden" }));
						builder.add(start + match[0].indexOf(content), start + match[0].indexOf(content) + content.length, generateBadgeDecoration(escapedContent, style));
						builder.add(start + match[0].indexOf(content) + content.length, end, Decoration.mark({ class: "bn-hidden" }));
					}
				}

				return builder.finish() as DecorationSet;
			}
		}, { decorations: v => v.decorations });
	}

	// Handle badge styling in reading view by processing HTML content
	private viewModeBadgeHighlighter() {
		return (el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
			const elements = Array.from(el.querySelectorAll("p, li, span, div, td, th"));

			elements.forEach(element => {
				const originalText = element.textContent;
				if (!originalText) return;

				let match: RegExpExecArray | null;
				let updatedHTML = element.innerHTML;
				let matchFound = false;

				while ((match = badgeSyntaxRegex.exec(originalText)) !== null) {
					matchFound = true;
					const { content = "", style = "" } = match.groups ?? {};
					const escapedContent = escapeHtml(content);
					const decoration = generateBadgeDecoration(escapedContent, style);
					const replacement = `<span class="${decoration.spec.class}">${escapedContent}</span>`;
					const escapedMatch = escapeHtml(match[0]);
					updatedHTML = updatedHTML.replace(escapedMatch, replacement);
				}

				if (matchFound) {
					element.innerHTML = updatedHTML;
				}
			});
		};
	}
}
