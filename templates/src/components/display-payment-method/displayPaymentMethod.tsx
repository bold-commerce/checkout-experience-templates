import {IApplicationStatePayment} from 'src/types';
import React from 'react';
import {useGetPaymentType} from 'src/hooks';

export function DisplayPaymentMethod(props: IApplicationStatePayment): React.ReactElement {
    const paymentType = useGetPaymentType(props);

    return (
        <div className={'display-payment-methods-content'}>
            {paymentType.paymentMethodName}: {paymentType.paymentMethodValue}
        </div>
    );
}
