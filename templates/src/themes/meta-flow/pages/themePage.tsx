import {
    Footer, FormControls,
    Header,
    HeaderHelmet,
    SummarySection
} from 'src/components';
import React, {useCallback, useEffect, useState} from 'react';
import {getCheckoutUrl, getTerm} from 'src/utils';
import {Constants} from 'src/constants';
import {useGetOnePageFooterData, useIsValidShippingOnLoad} from 'src/themes/one-page/hooks';
import {checkInventoryStage} from '@boldcommerce/checkout-frontend-library';
import {useDispatch} from 'react-redux';
import {checkInventory, setDefaultAddresses} from 'src/library';
import {useAppSelector, useIsUserAuthenticated} from 'src/hooks';
import {ICheckoutFlowParameters} from 'src/themes/flow-sdk/types';

export function ThemePage(): React.ReactElement {
    window.history.replaceState(null, '', getCheckoutUrl(Constants.RESUME_ROUTE));
    useIsValidShippingOnLoad();
    const onePageFooterProps = useGetOnePageFooterData();
    const mainAriaLabel = getTerm('checkout_form_title', Constants.GLOBAL_INFO, undefined , 'Checkout form');
    const dispatch = useDispatch();
    const isCustomerLoggedIn = useIsUserAuthenticated();
    const initialData = useAppSelector(state => state.data);
    const [isFlowStarted, setIsFlowStarted] = useState(false);
    const onClickCheckout = useCallback(() => {
        if (isFlowStarted && window.bold?.canCheckoutWithFlow()) {
            window.bold?.onCheckoutClick && window.bold.onCheckoutClick();
        } else {
            alert('Redirect to normal Checkout flow!');
        }
    }, [isFlowStarted]);
    const flowElementId = 'meta-pay-container';
    const footerProps = {...onePageFooterProps, nextButtonOnClick: onClickCheckout, nextButtonLoading: false,};

    useEffect(() => {
        dispatch(checkInventory(checkInventoryStage.initial));

        if (isCustomerLoggedIn) {
            dispatch(setDefaultAddresses);
        }

        if(window.bold?.initFlow && typeof window.bold?.initFlow === 'function') {
            const params: ICheckoutFlowParameters = {
                shopIdentifier: window.shopIdentifier,
                flowElementId: '',
                boldSecureUrl: 'https://spt-felipe-santos.bold.ninja', // TODO: get url from window variable (add to window variable on Checkout view loading)
                environment: window.environment,
            };
            window.bold.initFlow(initialData, params).then(() => setIsFlowStarted(true));
        }
    }, []);

    return (
        <div className={'checkout-experience-container'}>
            <Header isMobile={true}/>
            <HeaderHelmet title={footerProps.title}/>
            <div className={'customer-section one-page'}>
                <Header isMobile={false}/>
                <main aria-label={mainAriaLabel}>

                    <div id={flowElementId} className={'flow-container'} data-testid={flowElementId}></div>

                    <FormControls {...footerProps}/>

                    <div id={'debug-logger'} className={'debug-logger'} style={{height: '100%', overflow:'auto'}}></div>

                </main>
                <Footer />
            </div>
            <SummarySection orderCompleted={true}/>
        </div>
    );
}
