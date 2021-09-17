import { createPortal } from 'react-dom';

import { ToastContainer } from 'react-toastify';

const ToastPortal = () => {
    return createPortal(<ToastContainer />, document.getElementById('toast-root') as HTMLElement);
};

export default ToastPortal;
