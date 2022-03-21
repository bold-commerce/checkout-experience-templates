import {Constants} from 'src/constants';
import {useGetPayments} from 'src/hooks';
import {IUseGetDisplayPaymentMethods} from 'src/types';
import {getTerm} from 'src/utils';

export function useGetDisplayPaymentMethods(): IUseGetDisplayPaymentMethods {
    const paymentsMethod = useGetPayments();
    const terms = {
        noPaymentMethod: getTerm('no_payment_method', Constants.PAYMENT_INFO),
    };

    return {paymentsMethod, terms};
}
