import { VercelRequest, VercelResponse } from "@vercel/node";
import http from "http";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const path = Array.isArray(req.query.path)
    ? req.query.path.join("/")
    : req.query.path || "";

  const queryString = req.url?.split("?")[1] || "";
  const targetUrl = `http://18.140.140.211:5550/api/v1/${path}${
    queryString ? "?" + queryString : ""
  }`;

  const options: http.RequestOptions = {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      ...(req.headers.authorization
        ? { Authorization: req.headers.authorization }
        : {}),
      host: "18.140.140.211",
    },
  };

  return new Promise((resolve) => {
    const proxyReq = http.request(targetUrl, options, (proxyRes) => {
      res.status(proxyRes.statusCode || 500);

      Object.entries(proxyRes.headers).forEach(([key, value]) => {
        if (value) res.setHeader(key, value);
      });

      proxyRes.pipe(res);
      proxyRes.on("end", resolve);
    });

    proxyReq.on("error", (err) => {
      res.status(500).json({ error: err.message });
      resolve(null);
    });

    if (req.body) {
      proxyReq.write(JSON.stringify(req.body));
    }

    proxyReq.end();
  });
}
