import React, { useEffect } from 'react';

import {useGetOutOfStock, } from 'src/hooks';
import {CloseableHeader, GenericMessageSection} from 'src/components';
import { useGetCloseBuyNow } from 'src/themes/buy-now/hooks';
import { sendEvents, sendPageView } from 'src/analytics';

export function OutOfStockPage(): React.ReactElement {
    const {terms, websiteName} = useGetOutOfStock();
    const closeBuyNow = useGetCloseBuyNow();

    useEffect(() => {
        sendPageView('/out-of-stock');
        sendEvents('Checkout', 'Landed on buy now /out-of-stock page');  
    }, []);

    return (
        <div className="checkout-experience-container" >
            <div className="buy-now-container">
                <div className={'buy-now out-of-stock'}>
                    <CloseableHeader title={websiteName} onClose={closeBuyNow} />
                    <GenericMessageSection
                        className={'out-of-stock__message'}
                        messageTitle={terms.outOfStockHeader}
                        messageText={terms.outOfStockBody}
                    />
                    <button data-testid="return-to-product" className={'buy-now__checkout-button'} onClick={closeBuyNow} >
                        {terms.returnToProduct}
                    </button>
                </div>
            </div>
        </div>
    );
}
