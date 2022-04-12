import React, { useEffect } from 'react';
import { sendEvents, sendPageView } from 'src/analytics';
import { Footer, GenericMessageSection, Header } from 'src/components';
import { Constants } from 'src/constants';
import { ISessionExpiredPageProps } from 'src/themes/buy-now/types';
import { getErrorTerm } from 'src/utils';

export function SessionExpiredPage(props: ISessionExpiredPageProps): React.ReactElement {
    const { closeModal } = props;
    const sessionExpiredHeader = getErrorTerm('session_expired', Constants.GENERIC_ERROR_INFO);
    
    useEffect(() => {
        sendPageView('/session-expired');
        sendEvents('Checkout', 'Landed on buy now /session-expired page');  
    }, []);
    
    return (
        <div className="checkout-experience-container">
            <div className="buy-now-container" style={{height: 'min-content', overflowX: 'hidden', overflowY: 'auto'}}>
                <div className="buy-now">
                    <Header isMobile={false}/>
                    <GenericMessageSection
                        className="session-expired__message"
                        messageTitle={sessionExpiredHeader}
                        messageText="Close this modal and try again"
                    />
                    <Footer
                        className="session-expired__footer-container"
                        nextButtonText="Close modal"
                        nextButtonOnClick={closeModal}
                    />
                </div>
            </div>
        </div>
    );
}