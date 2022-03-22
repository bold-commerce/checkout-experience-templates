import {useCallback, useState} from 'react';
import {useScreenWidth, useGetLineItems} from 'src/hooks';
import {getTotalLineItems} from 'src/utils';
import {IUseCartSummary} from 'src/types';


export function useCartSummary(): IUseCartSummary{
    const screenWidth = useScreenWidth();
    const isWideScreen = screenWidth >= 767;
    const [expandSummary, setExpandSummary] = useState(isWideScreen);
    const showSummary = isWideScreen || expandSummary;
    const toggleSummary = useCallback(() => setExpandSummary(!expandSummary), [expandSummary]);

    const lineItems = useGetLineItems();
    const totals = getTotalLineItems(lineItems);

    return {expandSummary, totals, showSummary, toggleSummary, lineItems};
}
