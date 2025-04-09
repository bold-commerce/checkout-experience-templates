import React from 'react';
import {FieldSection, LockedSection, LoadingSection} from 'src/components';
import {useGetIsSessionInitialized, useGetPaymentSection} from 'src/hooks';
import {IPaymentProps} from 'src/types';
import {EpsPayment} from 'src/components/eps-payment/EpsPayment';

export function Payment({showTitle = true, loadIframeImmediately = false} : IPaymentProps): React.ReactElement {
    const {isValidAddress, isValidShippingLine, notValidText, fieldSectionText} = useGetPaymentSection();
    const isSessionInitialized = useGetIsSessionInitialized();

    const paymentComponent = (
        <div className={'payment__block'}>
            <LoadingSection className={'payment__no-valid-address'} isLoading={false}/>
            <EpsPayment/>
        </div>);

    return (
        <div className={'payment'}>
            <FieldSection title={fieldSectionText} className={'payment__FieldSection'} showTitle={showTitle}>
                {
                    (loadIframeImmediately && isSessionInitialized) || (!loadIframeImmediately && isValidAddress && isValidShippingLine) ?
                        paymentComponent :
                        <LockedSection classNameSection={'payment__no-valid-address'}
                            className={'payment__no-valid-address-label'}
                            text={notValidText}/>
                }
            </FieldSection>
        </div>
    );
}
