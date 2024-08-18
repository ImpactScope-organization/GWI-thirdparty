/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4DC601",
        darkGreen: "#4DC601",
        reportGrey: "#8A929D",
        greyText: "#6C7275",
        foggyGrey: "#6C727540",
        lightgrey: "#E8ECEF",
        borderLight: "#EDEFF2",
        blackText: "#141718",
        danger: "#FF4158",
        review: "#3377FF",
        darkBlack: "#181E2f",
      },
    },
  },
  plugins: [],
};
