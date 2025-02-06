module.exports = {
    content: [
      "./src/**/*.{html,js}", 
      "./css/**/*.css", 
      "./coming.html", 
    ],
    theme: {
      extend: {
        animation: {
          marquee: 'marquee 15s linear infinite', 
        },
        keyframes: {
          marquee: {
            '0%': { transform: 'translateX(100%)' },
            '100%': { transform: 'translateX(-100%)' },
          },
        },
      },
    },
    plugins: [],
  };
