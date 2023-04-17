import React, {useEffect} from 'react';

import {useGetOutOfStock,} from 'src/hooks';
import {CloseableHeader, GenericMessageSection} from 'src/components';
import {useFocusTrap, useGetCloseBuyNow} from 'src/themes/buy-now/hooks';
import {sendEvents, sendPageView} from 'src/analytics';
import FocusTrap from 'focus-trap-react';

export function OutOfStockPage(): React.ReactElement {
    const {terms} = useGetOutOfStock();
    const {closeBuyNow, websiteName} = useGetCloseBuyNow();
    const {activeElement, focusTrapOptions} = useFocusTrap();

    useEffect(() => {
        sendPageView('/out-of-stock');
        sendEvents('Landed on buy now /out-of-stock page', {'category': 'Checkout'});
    }, []);

    return (
        <FocusTrap active={activeElement === 'out_of_stock'} focusTrapOptions={focusTrapOptions}>
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
        </FocusTrap>
    );
}
