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

                button {
                    background-color: ${theme.colors.primary};
                    color: ${theme.colors.white};
                    box-sizing: border-box;
                    border: none;
                    outline: 0;
                    text-align: center;
                    padding: 0.5rem 1rem;
                    border-radius: 10px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    svg {
                        align-items: center;
                        pointer-events: none;
                    }
                    span {
                        pointer-events: none;
                    }
                    &:hover {
                        background-color: ${theme.colors.primaryDark};
                    }
                }
            `}
        />
    );
};
