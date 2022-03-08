import React from 'react';
import {Address} from 'src/components';
import {getTerm} from 'src/utils';
import {Constants} from 'src/constants';

export function ShippingAddress(): React.ReactElement {
    return (
        <div className={'shipping-address'}>
            <Address title={getTerm('shipping_address',Constants.SHIPPING_INFO)}
                type={Constants.SHIPPING}
                showTitle={true}
                showSavedAddresses={false}
            />
        </div>
    );
}

