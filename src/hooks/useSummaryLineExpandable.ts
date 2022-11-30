import {useCallback, useState} from 'react';
import {getClassesListSummary, getFieldNamesSummary} from 'src/utils';
import {ISummaryLineExpandable, IUseSummaryLineExpandable} from 'src/types';
import {useGetCurrencyInformation} from 'src/hooks';

export function useSummaryLineExpandable(props: ISummaryLineExpandable): IUseSummaryLineExpandable{
    const [expand, setExpand] = useState(!!props.isExpanded);
    const [classes, setClasses] = useState(getClassesListSummary(props.eventToggleName, true, !!props.hasBottom, !!props.hasList));
    const toggle = useCallback(() => {
        setExpand(!expand);
        setClasses(getClassesListSummary(props.eventToggleName, expand, !!props.hasBottom, !!props.hasList));
    }, [expand]);

    const fieldNames = getFieldNamesSummary(props.eventToggleName);
    const {formattedPrice} = useGetCurrencyInformation();

    return {expand, classes, toggle, fieldNames, formattedPrice};
}
