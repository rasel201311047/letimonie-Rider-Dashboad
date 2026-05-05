/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
const http = require("http");

module.exports = async function handler(req: any, res: any) {
  const path = Array.isArray(req.query.path)
    ? req.query.path.join("/")
    : req.query.path || "";

  const queryString = req.url?.split("?")[1] || "";
  const targetUrl = `http://18.140.140.211:5550/api/v1/${path}${
    queryString ? "?" + queryString : ""
  }`;

  console.log("Proxying to:", targetUrl, "Method:", req.method);

  const bodyData = req.body ? JSON.stringify(req.body) : null;

  const options = {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      ...(req.headers.authorization
        ? { Authorization: req.headers.authorization }
        : {}),
      host: "18.140.140.211",
      ...(bodyData ? { "Content-Length": Buffer.byteLength(bodyData) } : {}),
    },
  };

  return new Promise((resolve) => {
    const proxyReq = http.request(targetUrl, options, (proxyRes: any) => {
      console.log("Response status:", proxyRes.statusCode);

      res.status(proxyRes.statusCode || 500);

      const skipHeaders = ["transfer-encoding", "connection", "keep-alive"];
      Object.entries(proxyRes.headers).forEach(([key, value]) => {
        if (value && !skipHeaders.includes(key.toLowerCase())) {
          res.setHeader(key, value as string);
        }
      });

      proxyRes.pipe(res);
      proxyRes.on("end", resolve);
    });

    proxyReq.on("error", (err: any) => {
      console.error("Proxy error:", err.message);
      res.status(500).json({ error: err.message });
      resolve(null);
    });

    if (bodyData) {
      proxyReq.write(bodyData);
    }

    proxyReq.end();
  });
};
