import React from 'react';

import {OrderRecap, Footer, GenericMessageSection, Header} from 'src/components';
import {useGetThankYou} from 'src/hooks';

export function ThankYou(): React.ReactElement {
    const {
        returnUrl,
        thankYouTitle,
        terms
    } = useGetThankYou();

    return(
        <div className={'thank-you'}>
            <Header isMobile={false}/>
            <GenericMessageSection
                className={'thank-you__message'}
                sectionTitle={thankYouTitle}
                messageTitle={terms.orderConfirmed}
                messageText={terms.orderConfirmedText}
            />
            <OrderRecap className={'thank-you__order-recap'}/>
            <Footer
                className={'thank-you__footer-container'}
                contactUs={true}
                nextButtonText={terms.keepShopping}
                nextButtonOnClick={returnUrl}
            />
        </div>
    );
}
