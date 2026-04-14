import type { NextConfig } from "next";

function apiImageRemotePatterns(): {
  protocol: "http" | "https";
  hostname: string;
  port?: string;
  pathname: string;
}[] {
  const raw = process.env.NEXT_PUBLIC_API_URL;
  if (!raw) return [];
  try {
    const u = new URL(raw);
    const protocol = (u.protocol.replace(":", "") || "https") as
      | "http"
      | "https";
    return [
      {
        protocol,
        hostname: u.hostname,
        ...(u.port ? { port: u.port } : {}),
        pathname: "/**",
      },
    ];
  } catch {
    return [];
  }
}

/** Logo de marca en S3 (mismo bucket que assets públicos). */
const brandLogoRemotePatterns = (): {
  protocol: "https";
  hostname: string;
  pathname: string;
}[] => [
  {
    protocol: "https",
    hostname: "fichamepe-assets-prod.s3.us-east-2.amazonaws.com",
    pathname: "/**",
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      ...apiImageRemotePatterns(),
      ...brandLogoRemotePatterns(),
    ],
  },
};

export default nextConfig;
