import type { NextConfig } from "next";
import {boardMembers} from './lib/board';

const nextConfig: NextConfig = {
  async redirects() {
    return boardMembers.filter(member => member.legacySlug).map(member => ({
      source: '/profiles/' + member.legacySlug,
      destination: '/profiles/' + member.slug,
      permanent: true,
    }));
  },
};

export default nextConfig;
