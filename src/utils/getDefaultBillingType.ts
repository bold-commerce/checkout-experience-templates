import {useGetAddressData} from 'src/hooks';
import {Constants} from 'src/constants';
import {isObjectEquals} from 'src/utils';

export function getDefaultBillingType(): string {
    const shipping = useGetAddressData(Constants.SHIPPING);
    const billing = useGetAddressData(Constants.BILLING);

    return isObjectEquals(shipping, billing) ? Constants.SHIPPING_SAME : Constants.SHIPPING_DIFFERENT;
}

