import React from 'react';
import {FieldSection, PaymentIframe, LockedSection, LoadingSection} from 'src/components';
import {useGetPaymentSection} from 'src/hooks';

export function Payment(): React.ReactElement {
    const {loading, isValidAddress, notValidText, fieldSectionText} = useGetPaymentSection();

    const paymentComponent = (
        <div className={'payment__block'}>
            <LoadingSection className={'payment__no-valid-address'} isLoading={loading}/>
            <PaymentIframe/>
        </div>);

    return (
        <div className={'payment'}>
            <FieldSection title={fieldSectionText} className={'payment__FieldSection'} showTitle={true}>
                {
                    (!isValidAddress) ?
                        <LockedSection classNameSection={'payment__no-valid-address'}
                            className={'payment__no-valid-address-label'}
                            text={notValidText}/>
                        : paymentComponent
                }
            </FieldSection>
        </div>
    );
}
