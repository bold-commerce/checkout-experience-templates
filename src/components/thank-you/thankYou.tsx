import React from 'react';

import {OrderRecap, FormControls, GenericMessageSection, Header, Footer, LifeFields} from 'src/components';
import {useGetLifeFields, useGetThankYou, useSendEvent} from 'src/hooks';
import {LifeInputLocationConstants} from 'src/constants';

export function ThankYou(): React.ReactElement {
    const {
        returnUrl,
        thankYouTitle,
        terms,
        isGeneric,
    } = useGetThankYou();

    const orderConfirmationLifeFields = useGetLifeFields(LifeInputLocationConstants.ORDER_CONFIRMATION);
    const orderDetailsLifeFields = useGetLifeFields(LifeInputLocationConstants.ORDER_DETAILS);

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
                    orderConfirmation={true}
                />
                <LifeFields lifeFields={orderConfirmationLifeFields}/>
                {!isGeneric && <OrderRecap className={'thank-you__order-recap'}/>}
                <LifeFields lifeFields={orderDetailsLifeFields}/>
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
