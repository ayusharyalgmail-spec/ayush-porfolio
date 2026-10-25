import vitals from "eslint-config-next/core-web-vitals";
import ts from "eslint-config-next/typescript";

const config = [
  ...vitals,
  ...ts,
  { ignores: [".next/**", "node_modules/**", "legacy/**", "productionproject/**", "demo/**", "playwright-report/**", "test-results/**", "next-env.d.ts"] },
];

export default config;
