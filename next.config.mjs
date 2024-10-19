/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'wrpcd.net',
                pathname: '/cdn-cgi/imagedelivery/**',
            },
            {
                protocol: 'https',
                hostname: 'i.imgur.com',
                pathname: '/G6Dx8nu.png',
            },
        ],
    },
};

export default nextConfig;
