import {useCallback, useState} from 'react';
import {useGetLineItems, useScreenBreakpoints} from 'src/hooks';
import {getTerm, getTotalLineItems} from 'src/utils';
import {IUseCartSummary} from 'src/types';
import {Constants} from 'src/constants';

export function useCartSummary(): IUseCartSummary{
    const {isMobile} = useScreenBreakpoints();
    const [expandSummary, setExpandSummary] = useState(!isMobile);
    const showSummary = !isMobile || expandSummary;
    const toggleSummary = useCallback(() => setExpandSummary(!expandSummary), [expandSummary]);
    const summaryAriaLabel = getTerm('order_summary', Constants.SUMMARY_INFO, undefined, 'Order summary');

    const lineItems = useGetLineItems();
    const totals = getTotalLineItems(lineItems);

    return {expandSummary, totals, showSummary, toggleSummary, lineItems, summaryAriaLabel};
}
