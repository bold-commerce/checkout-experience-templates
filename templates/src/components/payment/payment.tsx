import React from 'react';
import {FieldSection, PaymentIframe, LockedSection, LoadingSection} from 'src/components';
import {useGetIsSessionInitialized, useGetPaymentSection} from 'src/hooks';
import {IPaymentProps} from 'src/types';

export function Payment({showTitle = true, loadIframeImmediately = false} : IPaymentProps): React.ReactElement {
    const {loading, isValidAddress, isValidShippingLine, notValidText, fieldSectionText, onLoad, isValidPigiLoad} = useGetPaymentSection();
    const isSessionInitialized = useGetIsSessionInitialized();

    const paymentComponent = (
        <div className={'payment__block'}>
            <LoadingSection className={'payment__no-valid-address'} isLoading={loading}/>
            <PaymentIframe onLoad={onLoad}/>
        </div>);

    return (
        <div className={'payment'}>
            <FieldSection title={fieldSectionText} className={'payment__FieldSection'} showTitle={showTitle}>
                {
                    (loadIframeImmediately && isSessionInitialized) || (!loadIframeImmediately && isValidAddress && isValidShippingLine && isValidPigiLoad) ?
                        paymentComponent :
                        <LockedSection classNameSection={'payment__no-valid-address'}
                            className={'payment__no-valid-address-label'}
                            text={notValidText}/>
                }
            </FieldSection>
        </div>
    );
}
