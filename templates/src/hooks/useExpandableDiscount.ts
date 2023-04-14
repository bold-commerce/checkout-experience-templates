import {useCallback, useState} from 'react';
import {Constants} from 'src/constants';
import {IUseExpandableDiscount} from 'src/types';
import {getTerm} from 'src/utils';

export function useExpandableDiscount(): IUseExpandableDiscount {
    const [expandDiscount, setExpandDiscount] = useState(false);
    const discountCodeInputText = getTerm('discount_code', Constants.SUMMARY_INFO);

    const toggleDiscount = useCallback(() => setExpandDiscount(!expandDiscount), [expandDiscount]);

    return {expandDiscount, toggleDiscount, discountCodeInputText};
}
