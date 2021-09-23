import { css, Global, useTheme } from '@emotion/react';
import 'fonts/fonts.css';

export const GlobalStyle = () => {
    const theme = useTheme();

    return (
        <Global
            styles={css`
                * {
                    margin: 0;
                    color: ${theme.colors.white};

                    font-family: 'Spoqa Han Sans Neo', 'sans-serif';
                }

                body,
                body div {
                    background-color: ${theme.colors.mainBackground};
                }

                input[type='text'] {
                    border-radius: 1px;
                }

                ul {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }
            `}
        />
    );
};
