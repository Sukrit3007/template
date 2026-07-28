import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The floating dev badge sits over the footer's bottom-left corner, which is
  // exactly where the social links are — it makes visual diffing unreliable.
  devIndicators: false,
};

export default nextConfig;
