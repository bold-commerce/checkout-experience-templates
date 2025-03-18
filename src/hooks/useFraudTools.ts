import {ICartParameters} from '@boldcommerce/checkout-frontend-library';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useGetFraudTools} from 'src/hooks';
import {patchOrderMetaData} from 'src/library';

export function useFraudTools(): void {
    const dispatch = useDispatch();

    const fraudTools = useGetFraudTools();

    const forterExists = fraudTools.some((tool) => tool.type === 'forter');

    function forterHandler(evt) {
        const token = evt.detail as string;
        const payload = {
            forter_token: token,
        } as ICartParameters;
        dispatch(patchOrderMetaData({
            cart_parameters: payload,
            note_attributes: null,
            tags: null,
            notes: null,
        }));
    }

    useEffect(() => {
        if (forterExists) {
            document.addEventListener('ftr:tokenReady', forterHandler);
            return () => {
                document.removeEventListener('ftr:tokenReady', forterHandler);
            };
        }
    }, [forterExists]);
}
