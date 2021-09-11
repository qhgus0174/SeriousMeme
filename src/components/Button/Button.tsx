import React from 'react';
import styled from '@emotion/styled';

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: React.SVGAttributes<SVGElement>;
    color?: IColor.color;
}

enum IColor {
    color = 'darkblue',
}

const Button = ({ children, icon, color, ...rest }: IButtonProps) => {
    return (
        <div>
            <CustomButton color={color} onClick={rest.onClick} type="button">
                {children}
            </CustomButton>
        </div>
    );
};

const handleColor = (color?: IColor) => {
    switch (color) {
        case 'darkblue':
            return '#004ecb';
        default:
            return '#004ecb';
    }
};

const CustomButton = styled.button<IButtonProps>`
    box-sizing: border-box;
    border: none;
    outline: 0;
    text-align: center;
    padding: 7px 16px;
    background: ${props => handleColor(props.color)};
    color: white;
    border-radius: 10px;
    cursor: pointer;
`;

export default Button;
