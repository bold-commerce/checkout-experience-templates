import {CustomerSection, Header, SummarySection} from 'src/components';
import React from 'react';
import {getCheckoutUrl} from 'src/utils';
import {Constants} from 'src/constants';
import { useIsValidShippingOnLoad } from '../hooks';

export function ThemePage(): React.ReactElement {
    window.history.replaceState(null, '', getCheckoutUrl(Constants.RESUME_ROUTE));
    useIsValidShippingOnLoad();

    return (
        <div className={'checkout-experience-container'}>
            <Header isMobile={true}/>
            <CustomerSection/>
            <SummarySection orderCompleted={false}/>
        </div>
    );
}
