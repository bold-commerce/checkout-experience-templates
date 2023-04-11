import React from 'react';
import {FieldSection, FieldInput, LoginPrompt} from 'src/components';
import {CheckboxField} from '@boldcommerce/stacks-ui/lib/';
import {Constants} from 'src/constants';
import {useGuestCustomer} from 'src/hooks/useGuestCustomer';
import ClassNames from 'classnames';
import {isShopifyPlatform} from 'src/utils';

export function GuestCustomer(): React.ReactElement {
    const {email, getTerm, emailError, handleChange, handleCheckboxChange, acceptMarketingChecked, acceptMarketingHidden} = useGuestCustomer();
    const acceptMarketingCss = ClassNames(
        'customer-information__accepts-marketing',
        {'hidden': acceptMarketingHidden}
    );

    return (
        <div className={'customer-information'}>
            <FieldSection
                title={getTerm('customer_info', Constants.CUSTOMER_INFO)}
                className={'customer-information__field-section'}
                accessory={isShopifyPlatform() ? <LoginPrompt /> : null}
                showTitle={true}
            >
                <FieldInput
                    placeholder={getTerm('email_address', Constants.CUSTOMER_INFO)}
                    className={'customer-information__email'}
                    handleChange={handleChange}
                    errorMessage={emailError}
                    value={email}
                    dataTestId={'email-address-input-field'}
                    id={'customer-information__email'}
                />
                <CheckboxField
                    label={getTerm('accepts_marketing', Constants.CUSTOMER_INFO)}
                    className={acceptMarketingCss}
                    checked={acceptMarketingChecked}
                    onChange={handleCheckboxChange}
                    data-testid={'accept-marketing-checkbox'}
                />
            </FieldSection>
        </div>
    );
}

