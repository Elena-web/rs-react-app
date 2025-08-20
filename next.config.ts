import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  output: 'export',
  //basePath: '/rs-react-app',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  distDir: './dist',
};

export default withNextIntl(nextConfig);
