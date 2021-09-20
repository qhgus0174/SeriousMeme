import React, { useContext, useEffect } from 'react';
import styled from '@emotion/styled';
import { css, Theme } from '@emotion/react';

export interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: JSX.Element;
    color?: keyof Theme['buttonColors'];
}

const Button = ({ children, icon, color = 'basic', ...rest }: IButtonProps) => {
    return (
        <>
            <BasicButton {...rest} icon={icon} color={color}>
                {icon}
                <span>{children}</span>
            </BasicButton>
        </>
    );
};

const BasicButton = styled.button<IButtonProps>`
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
    color: ${props => props.theme.colors.white};

    ${props => `
        background-color: ${props.theme.buttonColors[props.color ? props.color : 'basic']};

        &:hover {
            background-color: ${props.theme.buttonColorsHover[props.color ? props.color : 'basic']};
        } 
    `}
`;

export const BasicButton2 = styled.button<IButtonProps>`
    span {
        margin-left: ${props => (props.icon ? 0.5 : 0)}em;
    }

    background: ${props => props.color};

    &:hover {
        background-color: ;
    }
`;

export default Button;
