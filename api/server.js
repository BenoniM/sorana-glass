import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

let serverEntry;
async function getServerEntry() {
  if (!serverEntry) {
    const serverPath = join(__dirname, "..", "dist", "server", "server.js");
    const mod = await import(serverPath);
    console.log("server.js export keys:", Object.keys(mod));
    console.log("server.js default type:", typeof mod.default);
    console.log("server.js default keys:", mod.default ? Object.keys(mod.default) : "null");

    // Also inspect the start asset
    const startPath = join(__dirname, "..", "dist", "server", "assets", "start-DGgvC3dX.js");
    try {
      const startMod = await import(startPath);
      console.log("start asset keys:", Object.keys(startMod));
      console.log("start asset default:", typeof startMod.default, startMod.default ? Object.keys(startMod.default) : "null");
    } catch (e) {
      console.log("start asset failed:", e.message);
    }

    serverEntry = mod.default ?? mod;
  }
  return serverEntry;
}

export default async function (req, res) {
  try {
    const h = await getServerEntry();

    const protocol = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers["x-forwarded-host"] || req.headers.host;
    const url = `${protocol}://${host}${req.url}`;

    const headers = new Headers();
    for (const [k, v] of Object.entries(req.headers)) {
      if (v != null) headers.set(k, Array.isArray(v) ? v.join(",") : v);
    }

    const webReq = new Request(url, { method: req.method, headers });

    let webRes;
    if (typeof h === "function") {
      console.log("Calling h as function");
      webRes = await h(webReq);
    } else if (h && typeof h.fetch === "function") {
      console.log("Calling h.fetch");
      webRes = await h.fetch(webReq);
    } else if (h && typeof h.handler === "function") {
      console.log("Calling h.handler");
      webRes = await h.handler(webReq);
    } else if (h && typeof h.default === "function") {
      console.log("Calling h.default");
      webRes = await h.default(webReq);
    } else {
      throw new Error("No callable handler. Keys: " + (h ? Object.keys(h).join(", ") : String(h)));
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