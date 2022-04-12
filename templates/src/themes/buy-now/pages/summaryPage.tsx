import classNames from 'classnames';
import React, { ForwardedRef } from 'react';
import { CloseableHeader, FlashError, NavigationHeading, TaxesAmount} from 'src/components';
import { Constants } from 'src/constants';
import { IBuyNowContainerPageProps } from 'src/themes/buy-now/types';
import { getTerm } from 'src/utils';
import { useGetCloseBuyNow, useIndexPage } from 'src/themes/buy-now/hooks';

function SummaryPage(props : IBuyNowContainerPageProps, ref: ForwardedRef<HTMLDivElement>): React.ReactElement {
    const { checkoutOnClick } = useIndexPage();
    const closeBuyNow = useGetCloseBuyNow();
    return (
        <div ref={ref} className={classNames('buy-now buy-now__secondary', props.show ? 'buy-now__secondary--open' : 'buy-now__secondary--closed')}>
            <div className='summary-page' >
                <FlashError/>
                <CloseableHeader className='buy-now__shipping-header' title={getTerm('summary', Constants.SUMMARY_INFO)} onClose={closeBuyNow} />
                <NavigationHeading className='buy-now__back' text={getTerm('previous_step',Constants.SAVED_PAYMENT_INFO)} navigation={() => props.navigateTo('/')} />
                <TaxesAmount orderCompleted={false}/>
                <button className='buy-now__checkout-button' data-testid='complete_order' onClick={checkoutOnClick}>
                    {getTerm('complete_order', Constants.PAYMENT_INFO)}
                </button>
            </div>
        </div>
    );
}

export const SummaryPageWrapper = React.forwardRef(SummaryPage);
