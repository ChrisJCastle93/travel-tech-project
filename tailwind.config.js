// tailwind.config.js
module.exports = {
  purge: {
    enabled: true,
    content: ["./views/**/*.hbs"],
  },
  theme: {
    // ...
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    // ...
  ],
};