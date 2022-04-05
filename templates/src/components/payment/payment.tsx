import React from 'react';
import {FieldSection, PaymentIframe, LockedSection, LoadingSection} from 'src/components';
import {useGetPaymentSection} from 'src/hooks';

export function Payment({ showTitle = true} : {showTitle?: boolean}): React.ReactElement {
    const {loading, isValidAddress, isValidShippingLine, notValidText, fieldSectionText, onLoad, isValidPigiLoad} = useGetPaymentSection();

    const paymentComponent = (
        <div className={'payment__block'}>
            <LoadingSection className={'payment__no-valid-address'} isLoading={loading}/>
            <PaymentIframe onLoad={onLoad}/>
        </div>);

    return (
        <div className={'payment'}>
            <FieldSection title={fieldSectionText} className={'payment__FieldSection'} showTitle={showTitle}>
                {
                    (!isValidAddress || !isValidShippingLine || !isValidPigiLoad) ?
                        <LockedSection classNameSection={'payment__no-valid-address'}
                            className={'payment__no-valid-address-label'}
                            text={notValidText}/>
                        : paymentComponent
                }
            </FieldSection>
        </div>
    );
}
