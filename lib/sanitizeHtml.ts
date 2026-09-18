import sanitizeHtmlLib from "sanitize-html";

// Sanitasi HTML rich-text SEBELUM menyeberang ke Client Component.
//
// Kenapa di server, bukan di komponen yang me-render: kalau disaring di
// client, markup berbahayanya sudah terlanjur dikirim ke browser dan tinggal
// bergantung pada satu pemanggilan yang bisa terlupa. Disaring di batas
// server, browser tidak pernah menerimanya sama sekali, dan bundle client
// tidak ikut membesar.
//
// Sumber HTML-nya adalah editor TipTap di panel admin, jadi penulisnya
// tepercaya — ini pertahanan untuk kasus akun admin dibobol, atau kalau nanti
// ada jalur input yang tidak lewat admin. Allowlist di bawah sengaja hanya
// berisi tag yang MEMANG bisa dihasilkan TipTap StarterKit + ekstensi Link
// (lihat components/admin/RichTextEditor.tsx); apa pun di luar itu dibuang.
const ALLOWED_TAGS = [
  "p", "br", "strong", "b", "em", "i", "s", "strike", "u", "code", "pre",
  "blockquote", "h1", "h2", "h3", "h4", "h5", "h6",
  "ul", "ol", "li", "hr", "a", "span",
];

export function sanitizeRichText(html: string | null | undefined): string {
  if (!html) return "";
  return sanitizeHtmlLib(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      // `target="_blank"` tanpa rel=noopener membuka jalan tabnabbing —
      // transformTags di bawah memaksanya selalu ikut.
      a: ["href", "target", "rel"],
      span: ["class"],
      code: ["class"],
      pre: ["class"],
    },
    // Hanya skema tautan yang aman. Ini yang memblokir `javascript:` —
    // vektor XSS paling umum yang lolos dari filter berbasis tag saja.
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesAppliedToAttributes: ["href"],
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          ...(attribs.target === "_blank"
            ? { rel: "noopener noreferrer" }
            : {}),
        },
      }),
    },
    // Buang isi <script>/<style> seluruhnya, bukan cuma tag pembungkusnya.
    nonTextTags: ["script", "style", "textarea", "option", "noscript"],
  });
}
