import ClassNames from 'classnames';
import React, {useEffect} from 'react';

import {Header, HeaderHelmet, ScreenReaderAnnouncement, SessionExpired} from 'src/components';
import {sendEvents, sendPageView} from 'src/analytics';
import {getTerm} from 'src/utils';
import {Constants} from 'src/constants';

export function SessionExpiredPage(): React.ReactElement {
    const title = getTerm('session_expiry_title', Constants.GLOBAL_INFO, undefined , 'Session expired');
    useEffect(() => {
        sendPageView('/session_expired');
        sendEvents('Landed on session expiry page', {'category': 'Checkout'});
    }, []);
    return (
        <div className={'checkout-experience-container'}>
            <HeaderHelmet title={title}/>
            <ScreenReaderAnnouncement content={title} />
            <div className={ClassNames(['three-page', 'no-summary'])}>
                <Header isMobile={true}/>
                <SessionExpired/>
            </div>
        </div>
    );
}
