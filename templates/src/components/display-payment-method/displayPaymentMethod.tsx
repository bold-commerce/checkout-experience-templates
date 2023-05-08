import React from 'react';
import {useGetPaymentType} from 'src/hooks';
import {IPayment} from '@boldcommerce/checkout-frontend-library';
import {Bullets} from 'src/components';

export function DisplayPaymentMethod(props: IPayment): React.ReactElement {
    const displayText = useGetPaymentType(props);
    const regexLast4Digits = /^[0-9]{4}$/;
    const isLast4Digits = regexLast4Digits.test(displayText);

    return (
        <div className={'display-payment-methods-content'}>
            {!isLast4Digits && displayText}
            {isLast4Digits &&
                <Bullets
                    brand={props.brand ?? ''}
                    lineText={displayText}
                />
            }
        </div>
    );
}
