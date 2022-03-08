import ClassNames from 'classnames';
import React from 'react';

import {Header, OutOfStock} from 'src/components';

export function OutOfStockPage(): React.ReactElement {
    return (
        <div className={'checkout-experience-container'}>
            <div className={ClassNames(['three-page', 'no-summary'])}>
                <Header isMobile={true} />
                <OutOfStock/>
            </div>
        </div>
    );
}
