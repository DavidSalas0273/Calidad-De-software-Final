export async function sha256(text: string): Promise<string> {
  const subtle = globalThis.crypto?.subtle;

  if (!subtle) {
    throw new Error("WebCrypto no disponible en este entorno.");
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
