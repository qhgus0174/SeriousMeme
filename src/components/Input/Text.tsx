import React from 'react';
import styled from '@emotion/styled';

interface ITextProps extends React.InputHTMLAttributes<HTMLInputElement> {
    width?: string;
}

const Text = ({ width, ...rest }: ITextProps) => {
    return <CustomInput type="text" placeholder={rest.placeholder} onClick={rest.onClick} />;
};

const CustomInput = styled.input<ITextProps>`
    width: ${props => (props.width ? props.width : '80')}%;
    padding: 10px;
`;

export default Text;
