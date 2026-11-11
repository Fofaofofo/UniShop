/** @type {import('next').NextConfig} */
// O browser fala sempre com /api (mesmo domínio) e o Next reencaminha para a API.
// Assim os cookies de sessão são "first-party" e funcionam em Safari/iOS.
const API_ORIGIN = process.env.API_ORIGIN || 'http://localhost:4000';

export default {
  images: { unoptimized: true },
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${API_ORIGIN}/:path*` }];
  },
};
