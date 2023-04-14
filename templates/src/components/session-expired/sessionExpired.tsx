import React, {useCallback} from 'react';

import {Footer, FormControls, GenericMessageSection, Header} from 'src/components';
import {getErrorTerm, getTerm} from 'src/utils';
import {Constants} from 'src/constants';
import {useGetShopUrlFromShopAlias} from 'src/hooks';

export function SessionExpired(): React.ReactElement {
    const returnToStore = getTerm('return_to_store', Constants.CUSTOMER_INFO, undefined, 'Return to store');
    const sessionExpiredHeader = getErrorTerm('session_expired', Constants.GENERIC_ERROR_INFO, undefined, 'Your checkout session expired');
    const sessionExpiredBody = getErrorTerm('return_to_store_and_checkout', Constants.GENERIC_ERROR_INFO, undefined, 'Return to your store and check out again');
    const returnUrl = useCallback(() => {
        window.location.href = useGetShopUrlFromShopAlias(window.shopAlias);
    }, []);

    return (
        <div className={'session-expired'}>
            <Header isMobile={false}/>
            <main aria-label={sessionExpiredHeader}>
                <GenericMessageSection
                    className={'session-expired__message'}
                    messageTitle={sessionExpiredHeader}
                    messageText={sessionExpiredBody}
                />
                <FormControls
                    className={'session-expired__footer-container'}
                    contactUs={true}
                    nextButtonText={returnToStore}
                    nextButtonOnClick={returnUrl}
                    nextButtonTestDataId={'session-expired-back-button'}
                />
            </main>
            <Footer />
        </div>
    );
}
