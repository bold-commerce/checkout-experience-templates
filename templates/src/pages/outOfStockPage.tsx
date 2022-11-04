import ClassNames from 'classnames';
import React, {useEffect} from 'react';

import {Header, HeaderHelmet, OutOfStock} from 'src/components';
import {sendEvents, sendPageView} from 'src/analytics';
import {getTerm} from 'src/utils';
import {Constants} from 'src/constants';

export function OutOfStockPage(): React.ReactElement {
    const title = getTerm('out_of_stock_title', Constants.GLOBAL_INFO, undefined , 'Out of stock');
    useEffect(() => {
        sendPageView('/out_of_stock');
        sendEvents('Checkout', 'Landed on out of stock page');
    },[]);
    return (
        <div className={'checkout-experience-container'}>
            <HeaderHelmet title={title}/>
            <div className={ClassNames(['three-page', 'no-summary'])}>
                <Header isMobile={true} />
                <OutOfStock/>
            </div>
        </div>
    );
}
