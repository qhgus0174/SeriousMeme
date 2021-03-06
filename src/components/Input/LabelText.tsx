import React from 'react';
import styled from '@emotion/styled';
import { ITextProps } from './TextBox';

interface ILabelTextProps extends ITextProps {
    label: string;
}

const LabelText = ({ label, ...rest }: ILabelTextProps) => {
    return (
        <TextFormDiv>
            <Label>
                <Span>{label}</Span>
                <Text type="text" {...rest} />
            </Label>
        </TextFormDiv>
    );
};

const TextFormDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    width: 100%;
    margin: 0.4em;
`;

const Span = styled.span`
    margin-bottom: 5px;
    color: ${props => props.theme.colors.main};
`;
const Label = styled.label`
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    padding: 0.4em 0.5em 0.5em 0.5em;
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 3px;
    outline-width: 3px;
    outline-offset: -2px;
    background-color: ${props => props.theme.colors.mainBackground};
    box-shadow: inset 0 0 2px #999999;

    &:focus-within {
        outline-color: ${props => props.theme.colors.main};
        outline-style: auto;
    }

    &:focus-within ${Span} {
        color: ${props => props.theme.colors.main};
    }
    font-size: 15px;
    width: 100%;
`;

const Text = styled.input`
    border: none;
    outline: none;
    background: none;
    width: 100%;
    font-size: 14px;
    padding-top: 0.2em;
    padding-bottom: 0.2em;
`;
export default LabelText;
