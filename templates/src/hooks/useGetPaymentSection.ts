import {Constants} from 'src/constants';
import {useGetLoaderScreenVariable, useGetValidVariable} from 'src/hooks';
import {getTerm} from 'src/utils';
import {IUseGetPaymentSection} from 'src/types';

export function useGetPaymentSection(): IUseGetPaymentSection {
    const notValidText = getTerm('no_payment_methods_invalid_address', Constants.PAYMENT_INFO);
    const fieldSectionText = getTerm('payment_method', Constants.PAYMENT_INFO);
    const loading = useGetLoaderScreenVariable('pigiIframe');
    const isValidAddress = useGetValidVariable('shippingAddress');
    const isValidShippingLine = useGetValidVariable('shippingLine');

    return {loading, isValidAddress, isValidShippingLine, notValidText, fieldSectionText};
}
