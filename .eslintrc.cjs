module.exports = {
  root: true,
  // Without this, `npm run lint` walks the build output after any `npm run
  // build` and drowns real findings in ~236 errors from minified bundles.
  ignorePatterns: ["dist", "node_modules", "public/3d"],
  env: { browser: true, es2021: true, node: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "detect" } },
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
  },
};
