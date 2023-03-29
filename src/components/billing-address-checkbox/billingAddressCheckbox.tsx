import React from 'react';
import {FieldSection, Address, FieldCheckbox} from 'src/components';
import {Constants} from 'src/constants';
import {useBillingAddress} from 'src/hooks';

export function BillingAddressCheckbox(): React.ReactElement {
    const {customBilling, billingTitle, billingSame, toggleBillingSameAsShipping} = useBillingAddress();

    const addressComponent = (<div className={'new-billing-address'}>
        <Address
            type={Constants.BILLING}
            showSavedAddresses={false}
            title={billingTitle}
            showTitle={false} />
    </div>);

    return (
        <div className={'billing-address-checkbox'}>
            <FieldSection title={billingTitle} className={'billing-address__FieldSection'} showTitle={true}>
                <div className={'billing-address-checkbox__checkbox'}>
                    <FieldCheckbox
                        label={billingSame}
                        value={Constants.SHIPPING_SAME}
                        dataTestId={'billing-address-checkbox'}
                        checked={customBilling === Constants.SHIPPING_SAME}
                        handleChange={toggleBillingSameAsShipping}
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

