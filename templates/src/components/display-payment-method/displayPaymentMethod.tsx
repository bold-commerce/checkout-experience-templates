import React from 'react';
import {useGetPaymentType} from 'src/hooks';
import {IPayment} from '@bold-commerce/checkout-frontend-library';
import {Constants} from 'src/constants';
import {Bullets} from 'src/components';

export function DisplayPaymentMethod(props: IPayment): React.ReactElement {
    const displayText = useGetPaymentType(props);

    return (
        <div className={'display-payment-methods-content'}>
            {displayText !== Constants.OTHER_PAYMENT_TYPE && displayText}
            {displayText === Constants.OTHER_PAYMENT_TYPE &&
                <Bullets
                    brand={props.brand ?? ''}
                    lineText={props.display_string !== '' ? props.display_string : (props.lineText ?? '')}
                />
            }
        </div>
    );
}
