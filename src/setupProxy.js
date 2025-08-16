const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://13.124.245.214:8080",
      changeOrigin: true,
      pathRewrite: { "^/api": "" },
    })
  );
};