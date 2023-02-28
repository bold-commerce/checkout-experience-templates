import React from 'react';
import {FieldSection, FieldRadio, Address} from 'src/components';
import {Constants} from 'src/constants';
import {useBillingAddress} from 'src/hooks';

export function BillingAddress(): React.ReactElement {
    const {customBilling, billingTitle, billingSame, billingDifferent, handleChange, addressProps} = useBillingAddress();

    const addressComponent = (<div className={'custom-billing'}>
        <Address {...addressProps}/>
    </div>);

    return (
        <div className={'billing-address'}>
            <FieldSection title={billingTitle} className={'address__FieldSection'} showTitle={true}>
                <div className={'shipping-same'}>
                    <FieldRadio
                        label={billingSame}
                        dataTestId={'billing-address-same'}
                        name={'radio-group'}
                        value={Constants.SHIPPING_SAME}
                        checked={customBilling === Constants.SHIPPING_SAME}
                        handleChange={handleChange}
                    />
                </div>
                <div className={'shipping-different'}>
                    <FieldRadio
                        label={billingDifferent}
                        name={'radio-group'}
                        dataTestId={'billing-address-different'}
                        value={Constants.SHIPPING_DIFFERENT}
                        checked={customBilling === Constants.SHIPPING_DIFFERENT}
                        handleChange={handleChange}
                    />
                </div>
                {
                    (customBilling === Constants.SHIPPING_DIFFERENT) ?
                        addressComponent
                        : null
                }
            </FieldSection>
        </div>
    );
}

