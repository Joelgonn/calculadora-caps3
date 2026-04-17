import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pacotes externos que devem ser tratados como externos
  serverExternalPackages: ['pdfjs-dist'],
  
  // Configuração vazia do Turbopack (silencia warnings)
  turbopack: {},
};

export default nextConfig;