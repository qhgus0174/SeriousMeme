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

        // mode: {
        //     mainBackground: string;
        //     primaryText: string;
        //     secondaryText: string;
        //     disable: string;
        //     border: string;
        //     divider: string;
        //     background: string;
        //     tableHeader: string;
        //     themeIcon: string;
        //     blue1: string;
        //     blue2: string;
        //     blue3: string;
        //     green: string;
        //     gray: string;
        // };
        // fontSizes: {
        //     xsm: string;
        //     sm: string;
        //     md: string;
        //     lg: string;
        //     xl: string;
        //     xxl: string;
        // };
        // fontWeights: {
        //     extraBold: number;
        //     bold: number;
        //     semiBold: number;
        //     regular: number;
        // };
    }
}
