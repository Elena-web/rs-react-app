import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  distDir: './dist',
  images: {
    unoptimized: true,
  },
  dynamicParams: true,
};

export default withNextIntl(nextConfig);
