// @ts-check
import antfu from "@antfu/eslint-config";

export default await antfu(
  {
    stylistic: {
      indent: 2,
      quotes: "double",
      semi: true,
    },

    // TypeScript and Vue are auto-detected, you can also explicitly enable them:
    typescript: true,
    unocss: false,
    vue: true,
    ignores: [
      "public/**",
      "README.md",
    ],
  },
  {
    rules: {
      // TODO: migrate all process reference to `import.meta.env` and remove this rule
      "node/prefer-global/process": "off",
    },
  },
);
