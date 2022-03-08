import {DisplayPaymentMethod} from 'src/components';
import React from 'react';
import {useGetDisplayPaymentMethods} from 'src/hooks';

export function DisplayPaymentMethods(): React.ReactElement {
    const {paymentsMethod, terms} = useGetDisplayPaymentMethods();

    return (
        <div className={'display-payment-methods-container'}>
            {
                paymentsMethod && paymentsMethod.length &&
                paymentsMethod.map((paymentMethod) => {
                    return (<DisplayPaymentMethod key={`payment-method-${paymentMethod.id}`} {...paymentMethod} />);
                })
            }
            {
                (!paymentsMethod || paymentsMethod.length <= 0) &&
                    <div className={'display-payment-methods-empty-content'}>
                        {terms.noPaymentMethod}
                    </div>
            }
        </div>
    );
}
