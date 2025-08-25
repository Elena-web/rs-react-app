declare module 'next-intl/plugin' {
  import { NextConfig } from 'next';
  export default function createNextIntlPlugin(): (
    nextConfig: NextConfig
  ) => NextConfig;
}
