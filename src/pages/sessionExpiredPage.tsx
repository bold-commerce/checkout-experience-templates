import ClassNames from 'classnames';
import React, {useEffect} from 'react';

import {Header, SessionExpired} from 'src/components';
import {sendEvents, sendPageView} from 'src/analytics';

export function SessionExpiredPage(): React.ReactElement {
    useEffect(() => {
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
