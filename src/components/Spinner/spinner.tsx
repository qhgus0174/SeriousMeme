import React, { useEffect, useState } from 'react';
import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import ClimbingBoxLoader from 'react-spinners/ClimbingBoxLoader';

interface ISpinner {
    visible: boolean;
}

const Spinner = ({ visible }: ISpinner) => {
    const theme = useTheme();
    const [isVisible, setIsVisible] = useState<boolean>(visible);

    useEffect(() => {
        setIsVisible(visible);
    }, [visible]);

    return (
        <LoadingContainer visible={isVisible}>
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
