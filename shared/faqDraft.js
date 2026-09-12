// The marker a Gemini FAQ draft uses for a fact it could not find in the
// knowledge base: "[ADMIN: what is needed]".
//
// Checked twice: in the Unanswered form (Publish stays disabled) and again in
// api/admin/faqs.js. Either check alone would be enough in the normal flow, but
// an unfilled placeholder in a published FAQ is shown to a prospective student
// as the answer. So the server refuses it even from a hand-written request, or
// from a draft pasted into the plain FAQ tab.

// Loose on purpose — "[admin:", "[ ADMIN" and a missing colon all count.
const ADMIN_PLACEHOLDER = /\[\s*ADMIN\b/i;

export function hasAdminPlaceholder(text) {
  return ADMIN_PLACEHOLDER.test(text || "");
}

export const PLACEHOLDER_ERROR = "Fill in or remove every [ADMIN: …] placeholder before publishing.";
