import {batchRequestOnePage} from 'src/library';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {getTerm} from 'src/utils';
import {Constants} from 'src/constants';
import {
    useGetAppSettingData,
    useGetLoaderScreenVariable,
    useGetRequiresShipping,
    useGetValidVariable
} from 'src/hooks';
import {IUseGetShippingLines} from 'src/types';

export function useGetBatchShippingLines(): IUseGetShippingLines {
    const dispatch = useDispatch();
    const notValidText = getTerm('no_shipping_invalid_address_updated', Constants.SHIPPING_METHOD_INFO);
    const fieldSectionText = getTerm('shipping_method', Constants.SHIPPING_METHOD_INFO);
    const taxShippingText = getTerm('shipping_tax_notification', Constants.SHIPPING_METHOD_INFO);
    const loading = useGetLoaderScreenVariable('shippingLines');
    const isValidAddress = useGetValidVariable('shippingAddress');
    const batchPostShippingAddress = useGetValidVariable('batchPostShippingAddress');
    const batchPostBillingAddress = useGetValidVariable('batchPostBillingAddress');
    const digitalProductOnly = useGetRequiresShipping();
    const billingType = useGetAppSettingData('billingType') as string;

    useEffect(() => {
        if (billingType === Constants.SHIPPING_SAME) {
            if (batchPostShippingAddress && batchPostBillingAddress) {
                dispatch(batchRequestOnePage(batchPostShippingAddress, batchPostBillingAddress, digitalProductOnly));
            }
        } else if (billingType === Constants.SHIPPING_DIFFERENT) {
            if (batchPostShippingAddress || batchPostBillingAddress) {
                dispatch(batchRequestOnePage(batchPostShippingAddress, batchPostBillingAddress, digitalProductOnly));
            }
        }
    }, [batchPostShippingAddress, batchPostBillingAddress]);

    return {loading, isValidAddress, notValidText, fieldSectionText, taxShippingText};
}
