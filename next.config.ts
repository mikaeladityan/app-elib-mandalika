import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    allowedDevOrigins: ["http://localhost:3001", "http://192.168.18.141:3001"],
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "is3.cloudhost.id",
                pathname: "/**", // Sesuaikan dengan path gambar Anda
                port: "",
            },
        ],
    },
};

export default nextConfig;
