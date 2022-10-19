import ClassNames from 'classnames';
import React, {useEffect} from 'react';

import {Header, OutOfStock} from 'src/components';
import {sendEvents, sendPageView} from 'src/analytics';

export function OutOfStockPage(): React.ReactElement {
    useEffect(() => {
        sendPageView('/out_of_stock');
        sendEvents('Checkout', 'Landed on out of stock page');
    },[]);
    return (
        <div className={'checkout-experience-container'}>
            <div className={ClassNames(['three-page', 'no-summary'])}>
                <Header isMobile={true} />
                <OutOfStock/>
            </div>
        </div>
    );
}
