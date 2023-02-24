import React from 'react';

import {useGetOutOfStock} from 'src/hooks';
import {Footer, FormControls, GenericMessageSection, Header} from 'src/components';

export function OutOfStock(): React.ReactElement {
    const {returnUrl, terms} = useGetOutOfStock();

    return (
        <div className={'out-of-stock'}>
            <Header isMobile={false}/>
            <main aria-label={terms.outOfStockHeader}>
                <GenericMessageSection
                    className={'out-of-stock__message'}
                    messageTitle={terms.outOfStockHeader}
                    messageText={terms.outOfStockBody}
                />
                <FormControls
                    className={'out-of-stock__footer-container'}
                    contactUs={true}
                    nextButtonText={terms.returnToCart}
                    nextButtonOnClick={returnUrl}
                    nextButtonTestDataId={'out-of-stock-back-button'}
                />
            </main>
            <Footer />
        </div>
    );
}
