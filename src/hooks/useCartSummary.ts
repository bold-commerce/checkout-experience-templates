import {useCallback, useState} from 'react';
import {useGetLineItems, useScreenBreakpoints} from 'src/hooks';
import {getTotalLineItems} from 'src/utils';
import {IUseCartSummary} from 'src/types';

export function useCartSummary(): IUseCartSummary{
    const {isMobile} = useScreenBreakpoints();
    const [expandSummary, setExpandSummary] = useState(!isMobile);
    const showSummary = !isMobile || expandSummary;
    const toggleSummary = useCallback(() => setExpandSummary(!expandSummary), [expandSummary]);

    const lineItems = useGetLineItems();
    const totals = getTotalLineItems(lineItems);

    return {expandSummary, totals, showSummary, toggleSummary, lineItems};
}
