import {getPaymentIframe} from 'src/library';
import {useDispatch} from 'react-redux';
import {useEffect, useState} from 'react';

export function useGetPigiUrl(): string {
    const dispatch = useDispatch();
    const [pigiUrl, setPigiUrl] = useState('');
    
    useEffect(() => {
        let isCancelled = false;

        dispatch(getPaymentIframe()).then((url) => {
            !isCancelled && url && setPigiUrl(url);
        });

        return () => {
            isCancelled = true;
        };
    }, []);

    return pigiUrl;
}
