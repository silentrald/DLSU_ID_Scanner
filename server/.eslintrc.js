module.exports = {
    env: {
        commonjs: true,
        es2021: true,
        node: true,
        'jest/globals': true
    },
    extends: 'eslint:recommended',
    plugins: ['jest'],
    parserOptions: {
        ecmaVersion: 12
    },
    rules: {
        indent: [
            'error',
            4
        ],
        quotes: [
            'error',
            'single'
        ],
        semi: [
            'error',
            'always'
        ],
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/prefer-to-have-length': 'warn',
        'jest/valid-expect': 'error'
    }
};
