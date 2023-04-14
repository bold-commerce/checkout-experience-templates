import React, {ForwardedRef} from 'react';
import {CloseableHeader, NavigationHeading, SummaryTotals} from 'src/components';
import {Constants} from 'src/constants';
import {IBuyNowContainerPageProps} from 'src/themes/buy-now/types';
import {getTerm} from 'src/utils';
import {useFocusTrap, useGetCloseBuyNow, useIndexPage} from 'src/themes/buy-now/hooks';
import FocusTrap from 'focus-trap-react';

function SummaryPage(props : IBuyNowContainerPageProps, ref: ForwardedRef<HTMLDivElement>): React.ReactElement {
    const {checkoutOnClick} = useIndexPage();
    const {closeBuyNow} = useGetCloseBuyNow();
    const {focusTrapOptions} = useFocusTrap();
    return (
        <FocusTrap active={props.show} focusTrapOptions={focusTrapOptions}>
            <div ref={ref} className={`buy-now buy-now__summary buy-now__secondary buy-now__secondary--${ props.show ? 'open' : 'closed'}`}>
                <CloseableHeader className='buy-now__summary-header' title={getTerm('summary', Constants.SUMMARY_INFO)} onClose={closeBuyNow} />
                <NavigationHeading className='buy-now__back' text={getTerm('previous_step',Constants.SAVED_PAYMENT_INFO)} navigation={() => props.navigateTo('/')} />
                <SummaryTotals orderCompleted={false}/>
                <button className='buy-now__checkout-button' data-testid='complete_order' onClick={checkoutOnClick}>
                    {getTerm('complete_order', Constants.PAYMENT_INFO)}
                </button>
            </div>
        </FocusTrap>
    );
}

export const SummaryPageWrapper = React.forwardRef(SummaryPage);
