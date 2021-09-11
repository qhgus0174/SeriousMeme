import React from 'react';
import styled from '@emotion/styled';

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: JSX.Element;
    color?: IColor.color;
}

enum IColor {
    color = 'darkblue',
}

const Button = ({ children, icon, color, ...rest }: IButtonProps) => {
    return (
        <>
            <BasicButton color={color} icon={icon} onClick={rest.onClick} type="button">
                {icon}
                <span>{children}</span>
            </BasicButton>
        </>
    );
};

const handleButtonColor = (color?: IColor) => {
    switch (color) {
        case 'darkblue':
            return '#004ecb';
        default:
            return '#004ecb';
    }
};

const BasicButton = styled.button<IButtonProps>`
    box-sizing: border-box;
    border: none;
    outline: 0;
    text-align: center;
    padding: 7px 16px;
    background: ${props => handleButtonColor(props.color)};
    color: white;
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    margin: 0.5rem;

    svg {
        align-items: center;
    }
    span {
        margin-left: ${props => (props.icon ? 0.5 : 0)}em;
    }
`;

export default Button;
