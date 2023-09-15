import {Constants} from 'src/constants';
import {getTerm} from 'src/utils';

export function useGetDatePickerLanguage(): Record<string, string[]> {

    return {
        days: [
            getTerm('date_picker_sunday', Constants.DATE_PICKER),
            getTerm('date_picker_monday', Constants.DATE_PICKER),
            getTerm('date_picker_tuesday', Constants.DATE_PICKER),
            getTerm('date_picker_wednesday', Constants.DATE_PICKER),
            getTerm('date_picker_thursday', Constants.DATE_PICKER),
            getTerm('date_picker_friday', Constants.DATE_PICKER),
            getTerm('date_picker_saturday', Constants.DATE_PICKER)
        ],
        months: [
            getTerm('date_picker_january', Constants.DATE_PICKER),
            getTerm('date_picker_february', Constants.DATE_PICKER),
            getTerm('date_picker_march', Constants.DATE_PICKER),
            getTerm('date_picker_april', Constants.DATE_PICKER),
            getTerm('date_picker_may', Constants.DATE_PICKER),
            getTerm('date_picker_june', Constants.DATE_PICKER),
            getTerm('date_picker_july', Constants.DATE_PICKER),
            getTerm('date_picker_august', Constants.DATE_PICKER),
            getTerm('date_picker_september', Constants.DATE_PICKER),
            getTerm('date_picker_october', Constants.DATE_PICKER),
            getTerm('date_picker_november', Constants.DATE_PICKER),
            getTerm('date_picker_december', Constants.DATE_PICKER),
        ]
    };
}
