module.exports = {
    parser: '@typescript-eslint/parser',  // Specifies the ESLint parser
    extends: [
        'plugin:@typescript-eslint/recommended',  // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    ],
    parserOptions: {
        ecmaVersion: 2018,  // Allows for the parsing of modern ECMAScript features
        sourceType: 'module',  // Allows for the use of imports
    },
    rules: {
        // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
        // e.g. "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/interface-name-prefix": ["error", { "prefixWithI": "always" }],
        "@typescript-eslint/no-inferrable-types": ["off"],
        "@typescript-eslint/no-empty-interface": ["off"],
        "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
        // Write a script that will generate this array
        "@typescript-eslint/camelcase": ["error", { allow: ["emulation_prevention_three_byte", "slice*", "tf_flags", "tk_flags", "tr_flags"]}],

        quotes: ["error", "double", { "allowTemplateLiterals": true }],
        semi: ["error", "always"],
        "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    },
};