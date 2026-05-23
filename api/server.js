import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

let handler;
async function getHandler() {
  if (!handler) {
    const serverPath = join(__dirname, "..", "dist", "server", "server.js");
    const mod = await import(serverPath);
    handler = mod.default ?? mod;
  }
  return handler;
}

export default async function (req, res) {
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
    console.error("SSR adapter error:", err);
    res.statusCode = 500;
    res.end("Internal Server Error: " + err.message);
  }
}
