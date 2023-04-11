import React from 'react';
import {FieldSection, AddressSavedSelect} from 'src/components';
import {CheckboxField} from '@boldcommerce/stacks-ui/lib/';
import {getTerm, isShopifyPlatform} from 'src/utils';
import {Constants} from 'src/constants';
import {useLogin} from 'src/hooks';
import ClassNames from 'classnames';

export function LoggedInCustomer(): React.ReactElement {
    const {loginUrl, email, handleCheckboxChange, acceptMarketingChecked, acceptMarketingHidden} = useLogin();
    const acceptMarketingCss = ClassNames(
        'customer-information__accepts-marketing',
        {'hidden': acceptMarketingHidden}
    );
    return (
        <div className={'customer-information'}>
            <FieldSection
                title={getTerm('customer_info', Constants.CUSTOMER_INFO)}
                className={'customer-information__field-section'}
                showTitle={true}
            >
                <div className={'customer-information__authenticated'}>
                    <span className='customer-information__authenticated-email'>{email}</span>
                    {
                        isShopifyPlatform() && <a className='customer-information__authenticated-not-you' href='#login' onClick={loginUrl}>
                            {getTerm('not_you', Constants.CUSTOMER_INFO)}
                        </a>
                    }
                </div>
                <CheckboxField
                    label={getTerm('accepts_marketing', Constants.CUSTOMER_INFO)}
                    className={acceptMarketingCss}
                    checked={acceptMarketingChecked}
                    onChange={handleCheckboxChange}
                    data-testid={'accept-marketing-checkbox'}
                />
                <div className={'address__saved'}>
                    <AddressSavedSelect type={Constants.SHIPPING} className={'address__saved-select'}/>
                </div>
            </FieldSection>
        </div>
    );
}

