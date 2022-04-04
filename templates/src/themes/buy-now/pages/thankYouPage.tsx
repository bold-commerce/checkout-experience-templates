import React from 'react';
import { CloseableHeader, GenericMessageSection, OrderRecap, ContactUs } from 'src/components';
import { useGetThankYou } from 'src/hooks';
import { useGetCloseBuyNow } from 'src/themes/buy-now/hooks';

export function ThankYouPage(): React.ReactElement{
    const { websiteName, thankYouTitle, terms} = useGetThankYou();
    const closeBuyNow = useGetCloseBuyNow();
    return (
        <div className="checkout-experience-container" >
            <div className="buy-now-container">
                <div className={'buy-now thank-you'}>
                    <CloseableHeader title={websiteName} onClose={closeBuyNow} />
                    <GenericMessageSection
                        className={'thank-you__message'}
                        sectionTitle={thankYouTitle}
                        messageTitle={terms.orderConfirmed}
                        messageText={terms.orderConfirmedText}
                    />
                    <OrderRecap className={'thank-you__order-recap'}/>
                    <ContactUs />
                    <button data-testid="continue-shopping" className={'buy-now__checkout-button'} onClick={closeBuyNow} >
                        {terms.keepShopping}
                    </button>
                </div>
            </div>
        </div>
    );
}