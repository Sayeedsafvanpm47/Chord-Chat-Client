export const tokensDark = {
          black: {
            100: "#cccccc",
            200: "#999999",
            300: "#666666",
            400: "#333333",
            500: "#000000",
            600: "#000000",
            700: "#000000",
            800: "#000000",
            900: "#000000",
          },
          white: {
            100: "#fafafa",
            200: "#f5f5f5",
            300: "#f0f0f0",
            400: "#ebebeb",
            500: "#e6e6e6",
            600: "#b8b8b8",
            700: "#8a8a8a",
            800: "#5c5c5c",
            900: "#2e2e2e",
          },
          gray: {
            100: "#ededed",
            200: "#dbdbdb",
            300: "#cacaca",
            400: "#b8b8b8",
            500: "#a6a6a6",
            600: "#858585",
            700: "#646464",
            800: "#424242",
            900: "#212121",
          },
          red: {
            100: "#f0d6d6",
            200: "#e1aeae",
            300: "#d18585",
            400: "#c25d5d",
            500: "#b33434",
            600: "#8f2a2a",
            700: "#6b1f1f",
            800: "#481515",
            900: "#240a0a",
          },
          lightred: {
            100: "#f7cece",
            200: "#ef9e9e",
            300: "#e66d6d",
            400: "#de3d3d",
            500: "#d60c0c",
            600: "#ab0a0a",
            700: "#800707",
            800: "#560505",
            900: "#2b0202",
          },
          purewhite: {
            100: "#ffffff",
            200: "#ffffff",
            300: "#ffffff",
            400: "#ffffff",
            500: "#ffffff",
            600: "#cccccc",
            700: "#999999",
            800: "#666666",
            900: "#333333",
          },
          formgray: {
            100: "#f7f7f7",
            200: "#f0f0f0",
            300: "#e8e8e8",
            400: "#e1e1e1",
            500: "#d9d9d9",
            600: "#aeaeae",
            700: "#828282",
            800: "#575757",
            900: "#2b2b2b",
          },
          button_red: {
            100: "#f7cece",
            200: "#ef9e9e",
            300: "#e66d6d",
            400: "#de3d3d",
            500: "#d60c0c",
            600: "#ab0a0a",
            700: "#800707",
            800: "#560505",
            900: "#2b0202",
          },
        };
        
        function reverseTokens(tokensDark) {
          const reversedTokens = {};
          Object.entries(tokensDark).forEach(([key, val]) => {
            const keys = Object.keys(val);
            const values = Object.values(val);
            const length = keys.length;
            const reversedObj = {};
            for (let i = 0; i < length; i++) {
              reversedObj[keys[i]] = values[length - i - 1]; // Corrected typo here
            }
            reversedTokens[key] = reversedObj;
          });
          console.log(reversedTokens);
          return reversedTokens;
        }
        export const tokensLight = reverseTokens(tokensDark);
        
        export const themeSettings = (mode) => {
          return {
            palette: {
              mode: mode,
              ...(mode === "dark"
                ? {
                    primary: {
                      ...tokensDark.black,
                      main: tokensDark.black[900],
                      light: tokensDark.black[900],
                    },
                    secondary: {
                      ...tokensDark.gray,
                      main: tokensDark.gray[200],
                    },
                    neutral: {
                      ...tokensDark.purewhite,
                      main: tokensDark.purewhite[500],
                    },
                    background: {
                      default: tokensDark.black[900],
                      alt: tokensDark.black[700],
                    },
                  }
                : {
                    primary: {
                      ...tokensDark.purewhite,
                      main: tokensDark.purewhite[500],
                    },
                    secondary: {
                      ...tokensDark.black,
                      main: tokensDark.black[900],
                      light: tokensDark.black[900],
                    },
                    neutral: {
                      ...tokensDark.gray,
                      main: tokensDark.gray[200],
                    },
                    background: {
                      default: tokensDark.purewhite[500],
                      alt: tokensDark.gray[700],
                    },
                  }),
            },
            typography: {
             fontFamily : ["Rajdhani","KaiseiOpti","Roboto","sans-serif"].join(','),
             fontSize: 12,
             h1:{
                    fontFamily:["Roboto","sans-serif"].join(','),
                    fontSize:40
             }
            },
          };
        };
        