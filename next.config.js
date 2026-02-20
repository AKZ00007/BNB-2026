/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['supabase.co'],
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                net: false,
                tls: false,
            }
        }
        config.externals.push('pino-pretty', 'lokijs', 'encoding')
        config.resolve.alias = {
            ...config.resolve.alias,
            '@react-native-async-storage/async-storage': false,
        }
        return config
    },
}

export default nextConfig
