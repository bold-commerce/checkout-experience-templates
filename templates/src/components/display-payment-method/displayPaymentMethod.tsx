import React from 'react';
import {useGetPaymentType} from 'src/hooks';
import {IPayment} from '@bold-commerce/checkout-frontend-library';

export function DisplayPaymentMethod(props: IPayment): React.ReactElement {
    const displayText = useGetPaymentType(props);

    return (
        <div className={'display-payment-methods-content'}>
            {displayText}
        </div>
    );
}
