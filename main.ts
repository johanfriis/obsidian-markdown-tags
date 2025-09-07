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

// Match ((tag/label/color)) syntax and extract label/color parts
const tagSyntaxRegex = /\(\(tag\/(?<label>[^\/\)]+)(?:\/(?<color>[^\/\)]*))?\)\)/g;

// Prevent XSS by escaping HTML entities for innerHTML insertion
const escapeHtml = (str: string): string => str.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char] || char));

// Create CodeMirror decoration with CSS classes for tag styling
function generateTagDecoration(label: string, color?: string): Decoration {
	const labelClass = sanitizeForCSS(label);
	const colorClass = color ? sanitizeForCSS(color) : '';
	const combinedClasses = `bn-tags ${labelClass} ${colorClass}`.trim();

	// Return the decoration with just CSS classes
	return Decoration.mark({
		class: combinedClasses
	});
}

export default class tagsPlugin extends Plugin {
	async onload() {
		this.registerEditorExtension(this.editModeTagsHighlighter());
		this.registerMarkdownPostProcessor(this.viewModeTagsHighlighter());
	}

	// Handle tag styling in edit mode using CodeMirror decorations
	private editModeTagsHighlighter() {
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

					while ((match = tagSyntaxRegex.exec(text)) !== null) {
						const start = from + (match.index ?? 0);
						const end = start + match[0].length;

						// Skip if cursor is editing this tag or tag is in code block
						if (cursorPos >= start && cursorPos <= end || (isInCodeBlock(start))) {
							continue;
						}

						const { label = '', color = '' } = match.groups ?? {};
						const escapedLabel = escapeHtml(label);
	
						// Apply decoration to hide the leading part
						builder.add(start, start + match[0].indexOf(label), Decoration.mark({ class: "bn-hidden" }));
						// Apply decoration to the inner text (label)
						builder.add(start + match[0].indexOf(label), start + match[0].indexOf(label) + label.length, generateTagDecoration(escapedLabel, color));
						// Apply decoration to hide the trailing part
						builder.add(start + match[0].indexOf(label) + label.length, end, Decoration.mark({ class: "bn-hidden" }));
					}
				}

				return builder.finish() as DecorationSet;
			}
		}, { decorations: v => v.decorations });
	}

	// Handle tag styling in reading view by processing HTML content
	private viewModeTagsHighlighter() {
		return (el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
			const tags = Array.from(el.querySelectorAll("p, li, span, div, td, th"));

			tags.forEach(tagElement => {
				const originalText = tagElement.textContent;
				if (!originalText) return;

				let match: RegExpExecArray | null;
				let updatedHTML = tagElement.innerHTML;
				let matchFound = false;

				// Process matches in the text content
				while ((match = tagSyntaxRegex.exec(originalText)) !== null) {
					matchFound = true;
					const { label = "", color = "" } = match.groups ?? {};
					const escapedLabel = escapeHtml(label);
					const decoration = generateTagDecoration(escapedLabel, color);
					const replacement = `<span class="${decoration.spec.class}">${escapedLabel}</span>`;
					const escapedMatch = escapeHtml(match[0]);
					updatedHTML = updatedHTML.replace(escapedMatch, replacement);
				}

				if (matchFound) {
					tagElement.innerHTML = updatedHTML;
				}
			});
		};
	}
}
