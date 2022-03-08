import ClassNames from 'classnames';
import React from 'react';

import {DisplayAddress, DisplayPaymentMethods, RecapDisplayItem} from 'src/components';
import {useGetOrderRecap} from 'src/hooks';
import {IOrderRecapProps} from 'src/types';

export function OrderRecap(props: IOrderRecapProps): React.ReactElement {
    const {
        noOrderData,
        shippingAddress,
        billingAddress,
        shippingDescription,
        terms
    } = useGetOrderRecap();

    const cssClass = ClassNames(['order-recap', props.className]);
    const getClass = (key: string) => ClassNames(['order-recap__display-item', `order-recap__display-item--${key}`]);

    return (
        <div className={cssClass}>
            {!noOrderData &&
                <div className={'order-recap__container'}>
                    <div className={'order-recap__title'}>{terms.customerInfo}</div>
                    <RecapDisplayItem className={getClass('shipping-address')} title={terms.shippingAddress} children={<DisplayAddress {...shippingAddress} />}/>
                    <RecapDisplayItem className={getClass('billing-address')} title={terms.billingAddress} children={<DisplayAddress {...billingAddress} />} />
                    <RecapDisplayItem className={getClass('shipping-method')} title={terms.shippingMethod} children={shippingDescription} />
                    <RecapDisplayItem className={getClass('payments-method')} title={terms.paymentMethod} children={<DisplayPaymentMethods />} />
                </div>
            }
        </div>
    );
}
