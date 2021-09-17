import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';

interface IToast {
    type: 'success' | 'warning' | 'info' | 'error';
    showTime?: number;
    maxCount?: number;
    children?: string;
}

const Toast = ({ type, showTime, maxCount, children }: IToast) => {
    const theme = useTheme();

    const bgColor = (): string => {
        switch (type) {
            case 'success':
                return theme.colors.success;
            case 'warning':
                return theme.colors.warning;
            case 'info':
                return theme.colors.info;
            case 'error':
                return theme.colors.error;
            default:
                return theme.colors.info;
        }
    };
    return <ToastContainer color={bgColor()}>{children}</ToastContainer>;
};

const ToastContainer = styled.div`
    background: ${props => props.color};
`;

export default Toast;
