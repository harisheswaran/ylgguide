const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
    js.configs.recommended,
    {
        ignores: ["eslint.config.js", "eslint.config.mjs", "node_modules/**"]
    },
    {
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: "commonjs",
            globals: {
                ...globals.node
            }
        },
        rules: {
            "no-unused-vars": ["warn", {
                "argsIgnorePattern": "^_",
                "varsIgnorePattern": "^_",
                "caughtErrorsIgnorePattern": "^_"
            }],
            "no-undef": "error"
        }
    }
];
