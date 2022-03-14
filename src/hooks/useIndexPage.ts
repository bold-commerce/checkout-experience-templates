import { useGetLineItems, useGetOrderTotal, useGetShippingData, useLogin } from 'src/hooks';
import { IUseIndexPageProps } from 'src/types';
import { getTerm } from 'src/utils';
import { Constants } from 'src/constants';

export function useIndexPage(): IUseIndexPageProps {
    const lineItems = useGetLineItems();
    const { email, loginUrl } = useLogin();
    const loginText = getTerm('not_you', Constants.CUSTOMER_INFO);
    const websiteName = window.shopName;
    const orderTotal = useGetOrderTotal();
    const address = useGetShippingData();
    const checkoutOnClick = () => { return null; };
    const summaryHeadingText =  getTerm('summary', Constants.SUMMARY_INFO);
    const shippingHeadingText = getTerm('shipping', Constants.SUMMARY_INFO);
    const paymentHeadingText = getTerm('payments', Constants.SUMMARY_INFO);

    return { loginUrl, loginText, orderTotal, websiteName, lineItems, summaryHeadingText, email, shippingHeadingText, address, paymentHeadingText, checkoutOnClick };
}
