import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Intercept ALL unhandled errors before h3 swallows them
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});
process.on("unhandledRejection", (reason) => {
  console.error("UNHANDLED REJECTION:", reason);
});

let serverEntry;
async function getServerEntry() {
  if (!serverEntry) {
    try {
      // Import the raw TanStack Start server entry directly, bypassing server.ts
      const entryPath = join(__dirname, "..", "dist", "server", "assets", "server-uEaPDobJ.js");
      console.log("Loading server entry from:", entryPath);
      const mod = await import(entryPath);
      console.log("Server entry exports:", Object.keys(mod));
      serverEntry = mod.default ?? mod;
    } catch (err) {
      console.error("FAILED TO LOAD SERVER ENTRY:", err);
      throw err;
    }
  }
  return serverEntry;
}

export default async function (req, res) {
  try {
    const h = await getServerEntry();

    const protocol = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers["x-forwarded-host"] || req.headers.host;
    const url = `${protocol}://${host}${req.url}`;

    console.log("Handling request:", req.method, url);

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

    let webRes;
    try {
      webRes = await h.fetch(webReq);
    } catch (fetchErr) {
      console.error("FETCH ERROR:", fetchErr);
      throw fetchErr;
    }

    console.log("Response status:", webRes.status);

    // Log body of 500s before consuming
    if (webRes.status >= 500) {
      const clone = webRes.clone();
      const text = await clone.text();
      console.error("500 RESPONSE BODY:", text);
    }

    res.statusCode = webRes.status;
    webRes.headers.forEach((v, k) => res.setHeader(k, v));
    const buf = await webRes.arrayBuffer();
    res.end(Buffer.from(buf));
  } catch (err) {
    console.error("SSR adapter error:", err?.stack ?? err);
    res.statusCode = 500;
    res.setHeader("content-type", "text/plain");
    res.end("SSR Error: " + (err?.stack ?? err?.message ?? String(err)));
  }
}
