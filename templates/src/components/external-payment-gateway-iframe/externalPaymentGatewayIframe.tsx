import React from 'react';
import {useGetExternalPaymentGatewayLoading, useGetPigiDisplaySca} from 'src/hooks';
import ClassNames from 'classnames';
import {IExternalPaymentGatewayIframeProps} from 'src/types';

export function ExternalPaymentGatewayIframe(props: IExternalPaymentGatewayIframeProps): React.ReactElement {
    const loading = useGetExternalPaymentGatewayLoading(props.externalPaymentGateway);
    const displaySca = useGetPigiDisplaySca();

    const cssClassIframe = ClassNames([
        'payment__iframe',
        {
            'payment__iframe--hidden': loading,
            'payment__iframe--display-sca': displaySca,
        },
    ]);

    return (
        <iframe id={props.externalPaymentGateway.public_id}
            src={props.externalPaymentGateway.iframe_url}
            className={cssClassIframe}
            width="100%"
            scrolling={'no'}
            frameBorder={'0'}
            onLoad={props.onLoad}
        />
    );
}
