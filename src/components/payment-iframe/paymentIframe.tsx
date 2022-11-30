import React from 'react';
import {Constants} from 'src/constants';
import {useGetLoaderScreenVariable, useGetPigiDisplaySca, useGetPigiUrl, useSetPigiListener} from 'src/hooks';
import ClassNames from 'classnames';
import {IPaymentIframe} from 'src/types';

export function PaymentIframe(props: IPaymentIframe): React.ReactElement {
    const pigiUrl = useGetPigiUrl();
    const loading = useGetLoaderScreenVariable('pigiIframe');
    const displaySca = useGetPigiDisplaySca();
    useSetPigiListener();

    const cssClassIframe = ClassNames([
        'payment__iframe',
        {
            'payment__iframe--hidden': loading,
            'payment__iframe--display-sca': displaySca,
        },
    ]);

    return (
        <iframe id={Constants.PIGI_IFRAME}
            src={pigiUrl}
            className={cssClassIframe}
            width="100%"
            scrolling={'no'}
            frameBorder={'0'}
            onLoad={props.onLoad}
        />
    );
}
