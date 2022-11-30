import React from 'react';

import {useGetSessionExpired} from 'src/hooks';
import {Footer, GenericMessageSection, Header} from 'src/components';

export function SessionExpired(): React.ReactElement {
    const {returnUrl, terms} = useGetSessionExpired();

    return (
        <div className={'session-expired'}>
            <Header isMobile={false}/>
            <GenericMessageSection
                className={'session-expired__message'}
                messageTitle={terms.sessionExpiredHeader}
                messageText={terms.sessionExpiredBody}
            />
            <Footer
                className={'session-expired__footer-container'}
                contactUs={true}
                nextButtonText={terms.returnToCart}
                nextButtonOnClick={returnUrl}
            />
        </div>
    );
}
