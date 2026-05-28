import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent the site from being embedded in an iframe (clickjacking protection)
  { key: "X-Frame-Options", value: "DENY" },

  // Prevent browsers from MIME-sniffing the content type
  { key: "X-Content-Type-Options", value: "nosniff" },

  // Only send the origin as referrer, never the full URL
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

  // Restrict browser features (camera, mic, etc.)
  { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=()" },

  // Force HTTPS for 1 year once visited (production only — set via hosting)
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },

  // Basic Content Security Policy — tightened over time as the app grows
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // unsafe-eval needed for Next.js dev + Three.js
      "style-src 'self' 'unsafe-inline'",                // unsafe-inline needed for Tailwind
      "img-src 'self' blob: data:",                      // blob/data needed for signature pad and photo previews
      "font-src 'self'",
      "connect-src 'self' blob:",   // blob: needed for Three.js ImageBitmapLoader (fetches blob URLs for embedded textures)
      "frame-src 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
