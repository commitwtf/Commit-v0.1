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
            {
                protocol: 'https',
                hostname: 'pbs.twimg.com',
                pathname: '/profile_images/1475184333329768450/vN6horsl_400x400.jpg'
            },
        ],
    },
};

export default nextConfig;
