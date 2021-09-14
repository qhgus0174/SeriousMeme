import React from 'react';
import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import ClimbingBoxLoader from 'react-spinners/ClimbingBoxLoader';

const Spinner = () => {
    const theme = useTheme();
    return (
        <LoadingContainer>
            <ClimbingBoxLoader color={theme.colors.primaryDark} />
        </LoadingContainer>
    );
};

const LoadingContainer = styled.div`
    display: flex;
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
