/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", "./public/**/*.{html,js}", "./index.html"],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "1.5rem",
      },
      fontFamily: {
        main: ["League Spartan"],
      },
      colors: {
        primary: {
          darkCyan: "hsl(180, 29%, 50%)",
        },
        secondary: {
          lightCyanBg: "hsl(180, 52%, 96%)",
          lightCyanFilterT: "hsl(180, 31%, 95%)",
          DarkCyan: {
            100: "hsl(180, 8%, 52%)",
            200: "hsl(180, 14%, 20%)",
          },
        },
      },
      boxShadow: {
        center: "0px 0px 10px 2px",
      },
    },
  },
  plugins: [],
};
