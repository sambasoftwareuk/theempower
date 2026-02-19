const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://theempower.org";

export function getUploadUrl(input: string) {
  // input:
  // "0uscrh2h2p2dmlsxmexa.png"
  // "/uploads/0uscrh2h2p2dmlsxmexa.png"
  // "uploads/0uscrh2h2p2dmlsxmexa.png"
  // "https://theempower.org/uploads/0uscrh2h2p2dmlsxmexa.png"

  if (!input) return input;

  // zaten absolute ise dokunma
  if (/^https?:\/\//i.test(input)) return input;

  // baştaki slashes
  let p = input.replace(/^\/+/, ""); // "/uploads/x" -> "uploads/x"

  // "uploads/" varsa filename’e indir
  if (p.startsWith("uploads/")) p = p.slice("uploads/".length);

  return `${SITE_URL}/uploads/${p}`;
}
