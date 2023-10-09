/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        BASE_URL: process.env.BASE_URL,
        SITE_TITLE: process.env.SITE_TITLE,
        BASE_URL_API: process.env.BASE_URL_API,
        SECRET: process.env.SECRET,
    },
    experimental: { appDir: true },

}

module.exports = nextConfig
