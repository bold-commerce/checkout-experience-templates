import React from 'react';
import {FieldSection, LockedSection, LoadingSection, ExternalPaymentGatewayIframe} from 'src/components';
import {
    useGetIsSessionInitialized,
    useGetExternalPaymentGatewaySection,
} from 'src/hooks';
import {IExternalPaymentGatewayProps} from 'src/types';

export function ExternalPaymentGateway({loadIframeImmediately, showTitle, externalPaymentGateway} : IExternalPaymentGatewayProps): React.ReactElement {
    const {loading, isValidAddress, isValidShippingLine, notValidText, fieldSectionText, onLoad, isValidExternalLoad} = useGetExternalPaymentGatewaySection(externalPaymentGateway);
    const isSessionInitialized = useGetIsSessionInitialized();

    const paymentComponent = (
        <div className={'payment__block'}>
            <LoadingSection className={'payment__no-valid-address'} isLoading={loading}/>
            <ExternalPaymentGatewayIframe onLoad={onLoad} externalPaymentGateway={externalPaymentGateway}/>
        </div>);

    const orderReadyForPayment = (loadIframeImmediately && isSessionInitialized)
        || (!loadIframeImmediately && isValidAddress && isValidShippingLine);
    const showIframe = loading || isValidExternalLoad || orderReadyForPayment;

    return (
        <div className={'payment'}>
            <FieldSection title={fieldSectionText} className={'payment__FieldSection'} showTitle={showTitle}>
                {
                    showIframe ?
                        paymentComponent :
                        <LockedSection classNameSection={'payment__no-valid-address'}
                            className={'payment__no-valid-address-label'}
                            text={notValidText}/>
                }
            </FieldSection>
        </div>
    );
}
