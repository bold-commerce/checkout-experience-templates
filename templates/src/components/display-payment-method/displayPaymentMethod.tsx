import {IApplicationStatePayment} from 'src/types';
import React from 'react';

export function DisplayPaymentMethod(props: IApplicationStatePayment): React.ReactElement {
    return (
        <div className={'display-payment-methods-content'}>
            {props.brand}
        </div>
    );
}
