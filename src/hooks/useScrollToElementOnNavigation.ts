import {useEffect} from 'react';
import {useHistory} from 'react-router';
import {scrollToElement} from 'src/utils';

export function useScrollToElementOnNavigation(className : string): void {
    const history = useHistory();

    useEffect(() => {
        history.listen(() => {
            scrollToElement(className);
        });
    });
}