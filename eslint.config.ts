import js from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        ignores: ['coverage', '**/public', '**/dist', 'pnpm-lock.yaml', 'pnpm-workspace.yaml'],
    },

    js.configs.recommended,
    ...tseslint.configs.recommended,
    eslintPluginPrettierRecommended,
    {
        files: ['**/*.{ts,tsx}'],
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-floating-promises': 'warn',
            '@typescript-eslint/no-unsafe-argument': 'warn',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
        },
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
    },

    {
        files: ['apps/api/**/*.{ts,tsx,js}'],
        ...tseslint.configs.recommendedTypeChecked[0],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,
            },
            sourceType: 'commonjs',
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            'react-refresh/only-export-components': 'off',
            'no-unused-vars': 'off',
            'react-hooks/exhaustive-deps': 'warn',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
        },
    },
);
