import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // This project does not use the React Compiler. Calling setState inside
      // an effect is the correct, intentional pattern here for SSR-safe browser
      // reads (theme / localStorage / matchMedia), async data loading, and the
      // count-up animation — so this advisory rule is disabled rather than
      // contorting those valid effects. Rules-of-hooks and exhaustive-deps stay on.
      "react-hooks/set-state-in-effect": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
