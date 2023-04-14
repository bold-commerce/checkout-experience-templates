import React, {useEffect} from 'react';
import {sendEvents, sendPageView} from 'src/analytics';
import {CloseableHeader, GenericMessageSection, OrderRecap, ContactUs} from 'src/components';
import {useGetThankYou} from 'src/hooks';
import {useFocusTrap, useGetCloseBuyNow} from 'src/themes/buy-now/hooks';
import FocusTrap from 'focus-trap-react';

export function ThankYouPage(): React.ReactElement{
    const {thankYouTitle, terms} = useGetThankYou();
    const {closeBuyNow, websiteName} = useGetCloseBuyNow();
    const {activeElement, focusTrapOptions} = useFocusTrap();


    useEffect(() => {
        sendPageView('/thank-you');
        sendEvents('Landed on buy now /thank-you page', {'category': 'Checkout'});
    }, []);

    return (
        <FocusTrap active={activeElement === 'thank_you'} focusTrapOptions={focusTrapOptions}>
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
        </FocusTrap>
    );
}