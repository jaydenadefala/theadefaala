/**
 * Minimal Lexical JSON -> plain paragraph strings converter. Domain
 * types like WritingPiece keep `body: string[]` (one entry per
 * paragraph) regardless of the fact that Payload stores it as Lexical
 * rich text internally — this is exactly the kind of shape mismatch
 * the adapter layer exists to absorb so components never know Payload
 * is there. Handles plain paragraphs of text nodes only; deliberately
 * not a full Lexical-to-everything renderer (headings, lists, links,
 * etc. can be added here later without touching any component).
 */

interface LexicalTextNode {
  type: "text";
  text: string;
}

interface LexicalParagraphNode {
  type: "paragraph";
  children: LexicalTextNode[];
}

interface LexicalRoot {
  root?: {
    children?: LexicalParagraphNode[];
  };
}

export function serializeRichTextToParagraphs(
  value: unknown
): string[] {
  const root = (value as LexicalRoot | null | undefined)?.root;
  if (!root?.children) return [];

  return root.children
    .filter((node): node is LexicalParagraphNode => node.type === "paragraph")
    .map((node) =>
      (node.children ?? [])
        .filter((child): child is LexicalTextNode => child.type === "text")
        .map((child) => child.text)
        .join("")
    )
    .filter((text) => text.trim().length > 0);
}
