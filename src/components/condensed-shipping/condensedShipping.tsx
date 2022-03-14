import React from 'react';
import { useGetSelectShippingLine } from 'src/hooks';
import { Price } from '@boldcommerce/stacks-ui';
import { getTerm, isObjectEmpty } from 'src/utils';
import { Constants } from 'src/constants';
import { IAddress } from 'src/types';

export function CondensedShipping({address, includeMethod = false}: {address: IAddress, includeMethod?: boolean }): React.ReactElement {
    const name = `${address.first_name} ${address.last_name}`;
    const shippingInfo = [
        address.address_line_1,
        address.address_line_2,
        address.city,
        address.province,
        address.postal_code,
        address.country
    ];

    const addressLine = shippingInfo.filter(x => !(isObjectEmpty(x))).join(', ');
    const { amount, description } = useGetSelectShippingLine();

    const selectAddress = getTerm('select_address', Constants.SHIPPING_INFO);
    if (!address || !address.address_line_1) {
        return (
            <div className='condensed-shipping' >
                <p>{selectAddress}</p>
            </div>
        ); 
    }

    return (
        <div className='condensed-shipping' >
            <div className='condensed-shipping__name'>{name}</div>
            <div className='condensed-shipping__address'>{addressLine}</div>
            { (includeMethod && description) &&
                <div className='condensed-shipping__method'>{description} - <Price amount={amount}/></div>
            }
        </div>
    );
}
