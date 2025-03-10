import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    extends: [
      "next/core-web-vitals",
      "plugin:@next/next/recommended",
      "plugin:@next/next/core-web-vitals",
      "plugin:react/recommended",
      "plugin:prettier/recommended",
    ],
    plugins: ["jsx-a11y", "prettier"],
    files: ["**/*.js", "**/*.jsx"],
    rules: {
      "react/prop-types": "off",
      "react/react-in-jsx-scope": 0,
      "react/jsx-filename-extension": [
        2,
        { extensions: [".js", ".jsx", ".ts", ".tsx"] },
      ],
      "react/jsx-props-no-spreading": ["warn", {
        "html": "ignore",
        "custom": "ignore",
        "explicitSpread": "ignore"
      }],
      "react/no-array-index-key": "warn",
      "react/no-danger": "warn",
      "react/no-deprecated": "error",
      "react/no-direct-mutation-state": "error",
      "react/no-unescaped-entities": "error",
      "react/no-unused-prop-types": "warn",
      "react/no-unused-state": "warn",
      "react/require-default-props": "warn",
      "react/self-closing-comp": "warn",
      "react/jsx-boolean-value": ["warn", "always"],
      "jsx-a11y/alt-text": ["error", {
        "elements": ["img", "object", "area", "input[type='image']"],
        "img": ["Image"],
        "object": ["Object"],
        "area": ["Area"],
        "input[type='image']": ["InputImage"]
      }],
      "jsx-a11y/anchor-is-valid": ["error", {
        "components": ["Link"],
        "specialLink": ["hrefLeft", "hrefRight"],
        "aspects": ["invalidHref", "preferButton"]
      }],
      "jsx-a11y/label-has-associated-control": ["error", {
        "labelComponents": [],
        "labelAttributes": [],
        "controlComponents": [],
        "assert": "both",
        "depth": 25
      }],
      "indent": ["error", "tab"],
      "linebreak-style": ["error", "unix"],
      "quotes": ["error", "single"],
      "jsx-quotes": ["error", "prefer-double"],
      "semi": ["error", "always"],
      "no-console": ["warn", { "allow": ["warn", "error"] }],
      "no-debugger": "warn",
      "no-unused-vars": ["warn", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }],
      "no-var": "error",
      "prefer-const": ["error", {
        "destructuring": "all",
        "ignoreReadBeforeAssign": true
      }],
      "prefer-arrow-callback": ["error", {
        "allowNamedFunctions": false,
        "allowUnboundThis": true
      }],
      "prefer-template": "error",
      "prettier/prettier": "error"
    },
  },
];

export default eslintConfig;
