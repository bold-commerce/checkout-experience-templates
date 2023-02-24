import React from 'react';

import {OrderRecap, FormControls, GenericMessageSection, Header, Footer} from 'src/components';
import {useGetThankYou, useSendEvent} from 'src/hooks';

export function ThankYou(): React.ReactElement {
    const {
        returnUrl,
        thankYouTitle,
        terms,
        isGeneric,
    } = useGetThankYou();

    // Beginning of sending event to back-end
    useSendEvent('CheckoutExperienceThankYouPageDisplayed');
    // of sending event to back-end

    return(
        <div className={'thank-you'}>
            <Header isMobile={false}/>
            <main aria-label={terms.orderConfirmed}>
                <GenericMessageSection
                    className={'thank-you__message'}
                    sectionTitle={thankYouTitle}
                    messageTitle={terms.orderConfirmed}
                    messageText={terms.orderConfirmedText}
                />
                {!isGeneric && <OrderRecap className={'thank-you__order-recap'}/>}
                <FormControls
                    className={'thank-you__footer-container'}
                    contactUs={true}
                    nextButtonText={terms.keepShopping}
                    nextButtonOnClick={returnUrl}
                    nextButtonTestDataId={'thank-you-return-to-store-button'}
                />
            </main>
            <Footer />
        </div>
    );
}
