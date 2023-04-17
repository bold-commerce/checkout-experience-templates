import React from 'react';
import {useGetSelectShippingLine, useGetCondensedShipping, useGetCurrencyInformation} from 'src/hooks';
import {Price} from '@boldcommerce/stacks-ui';
import {getTerm} from 'src/utils';
import {Constants} from 'src/constants';
import {ICondensedShippingProps} from 'src/types';

export function CondensedShipping({address, showMethod = false, showPhone = false}: ICondensedShippingProps): React.ReactElement {
    const {name, addressLine, phone} = useGetCondensedShipping(address);
    const {amount, description} = useGetSelectShippingLine();
    const {formattedPrice} = useGetCurrencyInformation();

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
            { (showPhone && phone) &&
                <div className={'condensed-shipping__phone'}>{phone}</div>
            }
            { (showMethod && description) &&
                <div className='condensed-shipping__method'>{description} - <Price amount={amount} moneyFormatString={formattedPrice}/></div>
            }
        </div>
    );
}
