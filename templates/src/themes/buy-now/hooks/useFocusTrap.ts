import { useLocation } from 'react-router-dom';
import { IUseFocusTrap } from 'src/themes/buy-now/types';

const checkCanFocusTrap = (): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, 100));
};

const checkCanReturnFocus = (): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, 100));
};

const focusTrapOptions = {
    checkCanFocusTrap,
    checkCanReturnFocus,
    escapeDeactivates: false
};

export function useFocusTrap(): IUseFocusTrap {
    const location = useLocation();
    const activeElement = location.pathname.split('/').pop();

    return {activeElement, focusTrapOptions};
}
