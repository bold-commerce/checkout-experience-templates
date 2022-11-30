import {Constants} from 'src/constants';
import {useGetCustomerInfoData, useGetBillingData, useGetShippingData, useGetSelectShippingLine} from 'src/hooks';
import {IUseGetOrderRecap} from 'src/types';
import {getTerm, isObjectEmpty} from 'src/utils';

export function useGetOrderRecap(): IUseGetOrderRecap {
    const customerInformation = useGetCustomerInfoData();
    const shippingAddress = useGetShippingData();
    const billingAddress = useGetBillingData();
    const shippingMethod = useGetSelectShippingLine();
    const terms = {
        customerInfo: getTerm('customer_info',Constants.CUSTOMER_INFO),
        shippingAddress: getTerm('shipping_address', Constants.SHIPPING_INFO),
        billingAddress: getTerm('billing_address', Constants.PAYMENT_INFO),
        shippingMethod: getTerm('shipping_method', Constants.SHIPPING_METHOD_INFO),
        paymentMethod: getTerm('payment_method', Constants.PAYMENT_INFO)
    };
    const firstName = customerInformation?.first_name ? customerInformation.first_name : '';
    const noOrderData = !firstName && isObjectEmpty(shippingAddress) && isObjectEmpty(billingAddress);
    const shippingDescription = shippingMethod?.description ? shippingMethod.description : '';

    return {
        noOrderData,
        shippingAddress,
        billingAddress,
        shippingDescription,
        terms
    };
}
