import { withNextVideo } from "next-video/process";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {

    domains: ['kmkzzsqbmjarjzfpopin.supabase.co'] // Replace with your actual Supabase storage domain

  }
};

export default withNextVideo(nextConfig, { folder: 'assets' });