import React from 'react';
import styled from '@emotion/styled';

interface ITextProps extends React.InputHTMLAttributes<HTMLInputElement> {
    width?: string;
}

const TextBox = ({ width, ...rest }: ITextProps) => {
    return <CustomInput {...rest} />;
};

const CustomInput = styled.input<ITextProps>`
    width: ${props => (props.width ? props.width : '100')}%;
    padding: 10px;
    box-sizing: border-box;
`;

export default TextBox;
