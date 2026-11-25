import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "node_modules/",
      "**/dist/",
      "**/coverage/",
      "contracts/",
      "docs/",
      ".github/",
    ],
  },
  ...tseslint.configs.strict,
);
