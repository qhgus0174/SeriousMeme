import { css, Global } from '@emotion/react';
import 'fonts/fonts.css';

export const GlobalStyle = () => (
    <Global
        styles={css`
            * {
                margin: 0;
                font-family: 'Spoqa Han Sans Neo', 'sans-serif';
            }
        `}
    />
);
