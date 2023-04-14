import {useLocation} from 'react-router-dom';
import {focusTrapOptions} from 'src/constants';
import {IUseFocusTrap} from 'src/themes/buy-now/types';

export function useFocusTrap(): IUseFocusTrap {
    const location = useLocation();
    const activeElement = location.pathname.split('/').pop();

    return {activeElement, focusTrapOptions};
}
