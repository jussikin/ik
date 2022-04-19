module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es2021": true,
        "node":true
    },
    plugins: ['jest'],
    extends: [
      'eslint:recommended',
      'plugin:jest/recommended'
    ],
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "rules": {
    }
}
