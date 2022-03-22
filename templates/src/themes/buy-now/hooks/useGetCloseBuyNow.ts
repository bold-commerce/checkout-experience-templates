import { useCallback } from 'react';

export function useGetCloseBuyNow(): () => void {
    const closeBuyNowModal = useCallback(() => {
        document.dispatchEvent(new CustomEvent('buyNow:close'));
    }, []);

    return closeBuyNowModal;
}
