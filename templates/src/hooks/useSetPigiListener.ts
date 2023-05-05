import {pigiActionTypes} from '@boldcommerce/checkout-frontend-library';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router';
import {Constants} from 'src/constants';
import {
    handlePigiAddPayment,
    handlePigiDisplayFullPage,
    handlePigiDisplayFullPageDone,
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
            case pigiActionTypes.PIGI_DISPLAY_IN_FULL_PAGE:
                dispatch(handlePigiDisplayFullPage());
                break;
            case pigiActionTypes.PIGI_DISPLAY_IN_FULL_PAGE_DONE:
                dispatch(handlePigiDisplayFullPageDone(payload));
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
