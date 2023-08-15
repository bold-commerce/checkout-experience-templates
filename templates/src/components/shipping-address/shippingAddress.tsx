import React from 'react';
import {Address} from 'src/components';
import {getTerm} from 'src/utils';
import {Constants} from 'src/constants';
import {useGetRequiresShipping} from 'src/hooks';

export function ShippingAddress(): React.ReactElement {

    const requiresShipping = useGetRequiresShipping();
    const title =  requiresShipping ? getTerm('shipping_address',Constants.SHIPPING_INFO) : getTerm('billing_address', Constants.PAYMENT_INFO);

    return (
        <div className={'shipping-address'}>
            <Address title={title}
                type={Constants.SHIPPING}
                showTitle={true}
                showSavedAddresses={false}
            />
        </div>
    );
}

