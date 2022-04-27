import ClassNames from 'classnames';
import React, {useEffect} from 'react';

import {Header, OutOfStock} from 'src/components';
import {sendEvents, sendPageView} from 'src/analytics';
import {getNeuroIdPageName, neuroIdInit} from 'src/utils';
import {NeuroIdConstants} from 'src/constants';

export function OutOfStockPage(): React.ReactElement {
    useEffect(() => {
        neuroIdInit(getNeuroIdPageName(NeuroIdConstants.outOfStockPage));

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
