import React from 'react';

import {useGetOutOfStock} from 'src/hooks';
import {Footer, GenericMessageSection, Header} from 'src/components';

export function OutOfStock(): React.ReactElement {
    const {returnUrl, terms} = useGetOutOfStock();

    return (
        <div className={'out-of-stock'}>
            <Header isMobile={false}/>
            <GenericMessageSection
                className={'out-of-stock__message'}
                messageTitle={terms.outOfStockHeader}
                messageText={terms.outOfStockBody}
            />
            <Footer
                className={'out-of-stock__footer-container'}
                contactUs={true}
                nextButtonText={terms.returnToCart}
                nextButtonOnClick={returnUrl}
            />
        </div>
    );
}
