import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        const devCorsHeaders = [
            { key: 'Access-Control-Allow-Origin', value: 'http://localhost:8887' },
            { key: 'Access-Control-Allow-Credentials', value: 'true' },
            { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
            { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ];

        if (process.env.NODE_ENV === 'production') return [];

        return [{ source: '/api/auth/:path*', headers: devCorsHeaders }];
    },

    serverExternalPackages: ['drizzle-orm', 'postgres'],

    images: {
        remotePatterns: [
            {
                hostname: "avatar.vercel.sh",
            },
        ],
    },
};

export default nextConfig;
