import js from "@eslint/js"
import react from 'eslint-plugin-react'
import jest from 'eslint-plugin-jest'

export default [
    js.configs.recommended,
    {
        ignores: [
            ".env",
            "webpack.config.js",
            "tailwind.config.js",
            "node_modules/",
            "build/",
        ],
    },
    {
        plugins: {
            react,
            jest
        },
        languageOptions: {
            globals: {
                document: true,
                process: true,
                test: true,
                expect: true
            },
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            },
        },
        rules: {
            "react/jsx-uses-vars": "error",
            "react/jsx-uses-react": "error"
        }
    }
];