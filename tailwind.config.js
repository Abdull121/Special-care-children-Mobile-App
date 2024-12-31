/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#0166FC",
        secondary: {
          Default: "#FFFFFF",
        },
        blue: {
          Default: "#0166FC",
        },
        black: {
          Default: "#000000",
        },
      },
      fontFamily: {
        psemibold: ["Poppins-SemiBold"],
        pregular: ["Poppins-Regular"],
        heading: ["Anton-Regular"],
      },
    },
  },
  plugins: [],
};
