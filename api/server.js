import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

let cachedHandler;

async function getHandler() {
  if (cachedHandler) return cachedHandler;

  const serverPath = join(__dirname, "..", "dist", "server", "server.js");
  const mod = await import(serverPath);

  // dist/server/server.js is compiled from src/server.ts which does:
  // export default { async fetch(request) { ... } }
  // So mod.default is the object with .fetch
  const candidate = mod.default ?? mod;

  if (typeof candidate === "function") {
    cachedHandler = { fetch: candidate };
  } else if (candidate && typeof candidate.fetch === "function") {
    cachedHandler = candidate;
  } else if (mod && typeof mod.fetch === "function") {
    cachedHandler = mod;
  } else {
    // Last resort: wrap whatever we got and log it
    const info = JSON.stringify({
      modKeys: Object.keys(mod),
      defaultType: typeof mod.default,
      defaultKeys: mod.default && typeof mod.default === "object" ? Object.keys(mod.default) : String(mod.default),
    });
    throw new Error("No fetch handler found in dist/server/server.js. Exports: " + info);
  }

  return cachedHandler;
}

export default async function handler(req, res) {
  try {
    const h = await getHandler();

    const protocol = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers["x-forwarded-host"] || req.headers.host;
    const url = `${protocol}://${host}${req.url}`;

    const headers = new Headers();
    for (const [k, v] of Object.entries(req.headers)) {
      if (v != null) headers.set(k, Array.isArray(v) ? v.join(",") : v);
    }

    const body =
      req.method !== "GET" && req.method !== "HEAD"
        ? await new Promise((resolve) => {
            const chunks = [];
            req.on("data", (c) => chunks.push(c));
            req.on("end", () => resolve(Buffer.concat(chunks)));
          })
        : undefined;

    const webReq = new Request(url, { method: req.method, headers, body });
    const webRes = await h.fetch(webReq);

    res.statusCode = webRes.status;
    webRes.headers.forEach((v, k) => res.setHeader(k, v));
    const buf = await webRes.arrayBuffer();
    res.end(Buffer.from(buf));
  } catch (err) {
    console.error("SSR handler error:", err?.stack ?? err);
    res.statusCode = 500;
    res.setHeader("content-type", "text/plain");
    res.end("SSR Error: " + (err?.stack ?? err?.message ?? String(err)));
  }
}
