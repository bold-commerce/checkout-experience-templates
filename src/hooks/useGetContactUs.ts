import {Constants} from 'src/constants';
import {IUseContactUs} from 'src/types';
import {getTerm} from 'src/utils';

export function useGetContactUs(): IUseContactUs {
    return {
        needHelp: getTerm('help', Constants.CONFIRMATION_PAGE_INFO),
        contactUs: getTerm('contact_us', Constants.CONFIRMATION_PAGE_INFO)
    };
}
