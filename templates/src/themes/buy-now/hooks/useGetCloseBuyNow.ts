import { useCallback } from 'react';
import { Constants } from 'src/constants';
import { getTerm } from 'src/utils';
import { IUseGetCloseBuyNow } from '../types';

export function useGetCloseBuyNow(): IUseGetCloseBuyNow {
    const websiteName = window.shopName;
    const terms = {
        closeModal: getTerm('buy_now_close_modal', Constants.CUSTOM),
        closeModalDescription: getTerm('buy_now_close_modal_description', Constants.CUSTOM)
    };
    const closeBuyNow = useCallback(() => {
        document.dispatchEvent(new CustomEvent('buyNow:close'));
    }, []);
    

    return {closeBuyNow, websiteName, terms};
}
