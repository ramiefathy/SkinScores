import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-*'],
    turbo: {
      resolveAlias: {
        '@/*': ['./src/*'],
      },
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  transpilePackages: ['@radix-ui'],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://localhost:6000',
    'https://3000-firebase-studio-1748782304886.cluster-ux5mmlia3zhhask7riihruxydo.cloudworkstations.dev',
    'https://6000-firebase-studio-1748782304886.cluster-ux5mmlia3zhhask7riihruxydo.cloudworkstations.dev',
  ],
};

export default nextConfig;
