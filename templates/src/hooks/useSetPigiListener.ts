import {pigiActionTypes} from '@bold-commerce/checkout-frontend-library';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router';
import {Constants} from 'src/constants';
import {
    handlePigiAddPayment,
    handlePigiHeight,
    handlePigiInitialized,
    handlePigiPaymentAdded,
    handlePigiRefreshOrder,
    handlePigiSca,
    removePigiListenerInLibrary,
    setPigiListenerInLibrary,
    updatePigiLanguage
} from 'src/library';
import {IPigiResponseData} from 'src/types';

export function useSetPigiListener(): void {
    const dispatch = useDispatch();
    const history: History = useHistory();

    const handlePigiMessage = (e) => {
        const {responseType, payload} = e.data as IPigiResponseData;

        if (responseType && payload && payload.height) {
            dispatch(handlePigiHeight(payload));
        }

        switch (responseType) {
            case pigiActionTypes.PIGI_INITIALIZED:
                dispatch(handlePigiInitialized());
                dispatch(updatePigiLanguage());
                break;
            case pigiActionTypes.PIGI_ADD_PAYMENT:
                dispatch(handlePigiAddPayment(payload, history));
                break;
            case pigiActionTypes.PIGI_PAYMENT_ADDED:
                dispatch(handlePigiPaymentAdded());
                break;
            case pigiActionTypes.PIGI_HANDLE_SCA:
                dispatch(handlePigiSca(payload, history));
                break;
            case pigiActionTypes.PIGI_REFRESH_ORDER:
                dispatch(handlePigiRefreshOrder());
                break;
        }
    };
    useEffect(() => {
        dispatch(setPigiListenerInLibrary(Constants.PIGI_IFRAME, handlePigiMessage));
        return () => {
            dispatch(removePigiListenerInLibrary());
        };
    }, []);
}
