/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

// next.config.js
module.exports =
 {
  env: {
    JWT_SECRET: process.env.JWT_SECRET,  // Add the JWT secret explicitly
  },
};

export default nextConfig;
