import ClassNames from 'classnames';
import React, {useEffect} from 'react';

import {Header, SessionExpired} from 'src/components';
import {sendEvents, sendPageView} from 'src/analytics';
import {getNeuroIdPageName, neuroIdInit} from 'src/utils';
import {NeuroIdConstants} from 'src/constants';

export function SessionExpiredPage(): React.ReactElement {
    useEffect(() => {
        neuroIdInit(getNeuroIdPageName(NeuroIdConstants.sessionExpiredPage));

        sendPageView('/session_expired');
        sendEvents('Checkout', 'Landed on session expiry page');
    }, []);
    return (
        <div className={'checkout-experience-container'}>
            <div className={ClassNames(['three-page', 'no-summary'])}>
                <Header isMobile={true}/>
                <SessionExpired/>
            </div>
        </div>
    );
}
