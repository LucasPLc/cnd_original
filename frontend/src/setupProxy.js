const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://cnd-app:8080',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // remove /api prefix when forwarding to backend
      },
    })
  );
};
