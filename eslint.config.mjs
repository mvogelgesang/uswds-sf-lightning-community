import eslintPluginLwc from "@lwc/eslint-plugin-lwc";
import babelParser from "@babel/eslint-parser";

export default [
  {
    files: [
      "force-app/main/default/lwc/**/*.js",
      "builder-app/main/default/lwc/**/*.js",
      "lookbook-app/main/default/lwc/**/*.js"
    ],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          parserOpts: {
            plugins: [
              "classProperties",
              ["decorators", { decoratorsBeforeExport: false }]
            ]
          }
        }
      }
    },
    plugins: {
      "@lwc/lwc": eslintPluginLwc // https://github.com/salesforce/eslint-plugin-lwc
    },
    rules: {
      "@lwc/lwc/no-deprecated": "error",
      "@lwc/lwc/valid-api": "error",
      "@lwc/lwc/no-document-query": "error",
      "@lwc/lwc/ssr-no-unsupported-properties": "error"
    }
  }
];
