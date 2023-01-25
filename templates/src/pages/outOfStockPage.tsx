import ClassNames from 'classnames';
import React, {useEffect} from 'react';

import {Header, HeaderHelmet, OutOfStock, ScreenReaderAnnouncement} from 'src/components';
import {sendEvents, sendPageView} from 'src/analytics';
import {getTerm} from 'src/utils';
import {Constants} from 'src/constants';

export function OutOfStockPage(): React.ReactElement {
    const title = getTerm('out_of_stock_title', Constants.GLOBAL_INFO, undefined , 'Out of stock');
    useEffect(() => {
        sendPageView('/out_of_stock');
        sendEvents('Landed on out of stock page', {'category': 'Checkout'});
    },[]);
    return (
        <div className={'checkout-experience-container'}>
            <HeaderHelmet title={title}/>
            <ScreenReaderAnnouncement content={title} />
            <div className={ClassNames(['three-page', 'no-summary'])}>
                <Header isMobile={true} />
                <OutOfStock/>
            </div>
        </div>
    );
}
