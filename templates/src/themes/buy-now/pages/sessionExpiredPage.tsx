import React, { useEffect } from 'react';
import { sendEvents, sendPageView } from 'src/analytics';
import { CloseableHeader, GenericMessageSection } from 'src/components';
import { useGetSessionExpired } from 'src/hooks';
import { useGetCloseBuyNow } from '../hooks';

export function SessionExpiredPage(): React.ReactElement {
    const {closeBuyNow, websiteName, terms: modalTerms} = useGetCloseBuyNow();
    const { terms: sessionTerms } = useGetSessionExpired();
    
    useEffect(() => {
        sendPageView('/session-expired');
        sendEvents('Checkout', 'Landed on buy now /session-expired page');  
    }, []);
    
    return (
        <div className="checkout-experience-container">
            <div className="buy-now-container" style={{height: 'min-content', overflowX: 'hidden', overflowY: 'auto'}}>
                <div className="buy-now">
                    <CloseableHeader title={websiteName} onClose={closeBuyNow} />
                    <GenericMessageSection
                        className="session-expired__message"
                        messageTitle={sessionTerms.sessionExpiredHeader}
                        messageText={modalTerms.closeModalDescription}
                    />
                    <button data-testid="close-modal" className={'buy-now__checkout-button'} onClick={closeBuyNow} >
                        {modalTerms.closeModal}
                    </button>
                </div>
            </div>
        </div>
    );
}