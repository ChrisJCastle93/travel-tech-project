// tailwind.config.js
module.exports = {
  purge: {
    enabled: true,
    content: ["./views/**/*.hbs", "./views/*.hbs", "/public/**/*.js"],
  },
  theme: {
    // ...
  },
  safelist: ["border-4"],
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    // ...
  ],
};
