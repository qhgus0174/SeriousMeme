import React, { useContext, useEffect, useState } from 'react';
import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import ClimbingBoxLoader from 'react-spinners/ClimbingBoxLoader';
import { SpinnerContext } from '~context/SpinnerContext';

interface ISpinner {
    visible: boolean;
}

const Spinner = () => {
    const theme = useTheme();
    console.log('스피너 레ㅐㄴ더링');
    useEffect(() => {
        console.log('스피너 리렌더링');
    });
    const { visible } = useContext(SpinnerContext);

    return (
        <LoadingContainer visible={visible}>
            <ClimbingBoxLoader color={theme.colors.primaryDark} />
        </LoadingContainer>
    );
};

const LoadingContainer = styled.div<ISpinner>`
    display: ${props => (props.visible ? 'flex' : 'none')};
    justify-content: center;
    align-items: center;
    position: fixed;
    background-color: rgba(0, 0, 0, 0.4);
    box-sizing: border-box;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
`;

export default Spinner;
