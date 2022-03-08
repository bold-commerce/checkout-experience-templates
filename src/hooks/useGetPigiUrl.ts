import {getPaymentIframe} from 'src/library';
import {useDispatch} from 'react-redux';
import {useEffect, useState} from 'react';

export function useGetPigiUrl(): string {
    const dispatch = useDispatch();
    const [pigiUrl, setPigiUrl] = useState('');
    useEffect(() => {
        dispatch(getPaymentIframe()).then((url) => {
            if(url) {
                setPigiUrl(url);
            }
        });
    }, []);

    return pigiUrl;
}
