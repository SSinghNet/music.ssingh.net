/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        colors: {
            white: "#E5E6E4",
            black: "#222426", // footer, album-item
            background: "#393C3F",
            primary: "#F2545B",
            secondary: "#181A1C", //navbar
            search: "#CFD2CD",
        }
    },
    plugins: [],
}

