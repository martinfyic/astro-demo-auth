/** @type {import("prettier").Config} */
export default {
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
  jsxSingleQuote: true,
  singleQuote: true,
  bracketSpacing: true,
  arrowParens: 'avoid',
  semi: true,
  plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
};
