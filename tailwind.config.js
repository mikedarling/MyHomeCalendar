/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/utils/**/*.{js,ts,jsx,tsx,mdx}',
    './public/**/*.html',
  ],
   safelist: [
    {
      pattern: /bg-(blue|sky)-\d{3}/,
      pattern: /(disabled|hover)/, // This regex matches all characters, effectively safelisting all possible base classes
    },
  ],
};
