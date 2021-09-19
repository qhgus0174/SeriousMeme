import React, { createContext, useState } from 'react';
import Spinner from '~components/Spinner/Spinner';

interface ISpinner {
    visible: boolean;
    setVisible: (e: boolean) => void;
}

export const SpinnerContext = createContext<ISpinner>({ visible: false, setVisible: (e: boolean) => {} });

const SpinnerProvider = ({ children }: { children: React.ReactNode }) => {
    const [visible, setVisible] = useState<ISpinner['visible']>(false);

    return (
        <SpinnerContext.Provider value={{ visible, setVisible }}>
            <Spinner />
            {children}
        </SpinnerContext.Provider>
    );
};

export default SpinnerProvider;
