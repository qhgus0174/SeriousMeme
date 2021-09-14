import React from 'react';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';

export interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: JSX.Element;
    color?: string;
}

const Button = ({ children, icon, color, ...rest }: IButtonProps) => {
    const theme = useTheme();
    return (
        <>
            <BasicButton {...rest} icon={icon} color={color}>
                {icon}
                <span>{children}</span>
            </BasicButton>
        </>
    );
};

export const BasicButton = styled.button<IButtonProps>`
    span {
        margin-left: ${props => (props.icon ? 0.5 : 0)}em;
    }

    background: ${props => props.color};
`;

export default Button;
