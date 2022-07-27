import { useLocation } from 'react-router-dom';
import { IUseFocusTrap } from 'src/themes/buy-now/types';

const checkFocusDelay = (): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, 700));
};

const focusTrapOptions = {
    checkCanFocusTrap: checkFocusDelay,
    checkCanReturnFocus: checkFocusDelay,
    escapeDeactivates: false
};

export function useFocusTrap(): IUseFocusTrap {
    const location = useLocation();
    const activeElement = location.pathname.split('/').pop();

    return {activeElement, focusTrapOptions};
}
