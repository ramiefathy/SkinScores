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
    optimizePackageImports: ['lucide-react'],
    webpackBuildWorker: true,
  },
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
  webpack: (config, { isServer, dev }) => {
    // Production-ready webpack optimization
    if (!isServer) {
      // Configure chunk loading
      config.output.chunkLoadingGlobal = 'webpackChunkSkinscores';
      config.output.crossOriginLoading = 'anonymous';
      
      // Dynamic public path for cross-origin environments
      if (dev) {
        config.output.publicPath = '/_next/';
      }
      
      // Optimize chunk splitting
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            framework: {
              name: 'framework',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler|next)[\\/]/,
              priority: 40,
              enforce: true,
            },
            lib: {
              test(module: any) {
                return module.size() > 160000 &&
                  /node_modules[/\\]/.test(module.identifier());
              },
              chunks: 'all',
              priority: 30,
              minChunks: 1,
              reuseExistingChunk: true,
            },
            tools: {
              name(module: any) {
                const match = module.context?.match(/[\\/]src[\\/]lib[\\/]tools[\\/]([^/]+)\.ts/);
                if (match) {
                  return `tool-${match[1]}`;
                }
                return 'tools';
              },
              test: /[\\/]src[\\/]lib[\\/]tools[\\/]/,
              chunks: 'async',
              priority: 25,
              enforce: true,
            },
            commons: {
              minChunks: 2,
              priority: 20,
            },
            shared: {
              name: 'shared',
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
      };
      
      // Configure module resolution
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
      
      // Add module rules for better chunk handling
      config.module.rules.push({
        test: /[\\/]src[\\/]lib[\\/]tools[\\/]/,
        sideEffects: false,
      });
    }
    
    return config;
  },
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://localhost:6000',
    'http://localhost:9000',
    'https://3000-firebase-studio-1748782304886.cluster-ux5mmlia3zhhask7riihruxydo.cloudworkstations.dev',
    'https://6000-firebase-studio-1748782304886.cluster-ux5mmlia3zhhask7riihruxydo.cloudworkstations.dev',
    'https://9000-firebase-studio-1748782304886.cluster-ux5mmlia3zhhask7riihruxydo.cloudworkstations.dev',
  ],
};

export default nextConfig;
