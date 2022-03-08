import ClassNames from 'classnames';
import React from 'react';

import {Header, SessionExpired} from 'src/components';

export function SessionExpiredPage(): React.ReactElement {
    return (
        <div className={'checkout-experience-container'}>
            <div className={ClassNames(['three-page', 'no-summary'])}>
                <Header isMobile={true}/>
                <SessionExpired/>
            </div>
        </div>
    );
}
