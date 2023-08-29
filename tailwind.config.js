/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode:'class',
  theme: {
    extend: {
      colors: {
        // lightteal:"#35536B",
        // lightblue:"#63A8C7",      
        // lightpink: "#F3CED5",       
        // lightsky:"#AAD1E2",
        // lightcream:"#FBF5E7",
        // lightlavender:"#E5E5F1",


        lightcream:"#E9E9F1",
        lightpink: "#D3D1DE",
        lightteal:"#214E4B",
        lightblue:"#6495A3",
        lightlavender:"#AFCDCD",

        alertcolor:"#a01c1c",
        menuBGColor:"#6495A3",
        darkMainColor: '#F3F4F6',
        darkMainBG: '#374151',
        darkAccentColor: '#F3F4F6',
        lightMainBG: '#F1F5F9',
        lightMainColor: '#3E4754',
        lightAccentColor: '#3E4754'
      },
    },
  },
  plugins: [],
}
