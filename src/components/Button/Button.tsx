import React from 'react';
import styled from '@emotion/styled';

export interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: JSX.Element;
}

const Button = ({ children, icon, ...rest }: IButtonProps) => {
    return (
        <>
            <BasicButton {...rest} icon={icon}>
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
`;

export default Button;
