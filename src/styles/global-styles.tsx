import { css, Global, useTheme } from '@emotion/react';
import 'fonts/fonts.css';

export const GlobalStyle = () => {
    const theme = useTheme();

    return (
        <Global
            styles={css`
                * {
                    margin: 0;
                    font-family: 'Spoqa Han Sans Neo', 'sans-serif';
                }
            `}
        />
    );
};
