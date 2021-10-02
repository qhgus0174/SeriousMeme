import '@emotion/react';

declare module '@emotion/react' {
    export interface Theme {
        colors: {
            mainBackground: string;
            main: string;
            main2: string;
            mainLignt: string;
            white: string;
            black: string;
            gray: string;
            border: string;
        };

        buttonColors: {
            none: string;
            cancel: string;
            main: string;
        };
    }
}
