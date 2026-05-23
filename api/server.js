import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Dynamically import the built SSR server
let handler;
async function getHandler() {
  if (!handler) {
    const mod = await import("../dist/server/server.js");
    handler = mod.default;
  }
  return handler;
}

export default async function (req, res) {
  const h = await getHandler();
  // Convert Node req/res to Web Request/Response
  const url = `https://${req.headers.host}${req.url}`;
  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) {
    if (v) headers.set(k, Array.isArray(v) ? v.join(",") : v);
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
}
