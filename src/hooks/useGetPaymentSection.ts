import {Constants} from 'src/constants';
import {useGetLoaderScreenVariable, useGetValidVariable} from 'src/hooks';
import {getTerm} from 'src/utils';

export function useGetPaymentSection(): { loading: boolean, isValidAddress: boolean, notValidText: string, fieldSectionText: string } {
    const notValidText = getTerm('no_payment_methods_invalid_address', Constants.PAYMENT_INFO);
    const fieldSectionText = getTerm('payment_method', Constants.PAYMENT_INFO);
    const loading = useGetLoaderScreenVariable('pigiIframe');
    const isValidAddress = useGetValidVariable('shippingAddress');

    return {loading, isValidAddress, notValidText, fieldSectionText};
}
