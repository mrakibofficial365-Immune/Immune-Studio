const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
export default { output: "export", images: { unoptimized: true }, basePath: base, assetPrefix: base || undefined, trailingSlash: true };
