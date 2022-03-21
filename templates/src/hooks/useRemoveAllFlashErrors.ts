import {IError, IErrorTerm} from 'src/types';
import {useGetErrors} from 'src/hooks';
import {errorShowType, errorsTerms} from 'src/constants';
import {actionRemoveError} from 'src/action';
import {Dispatch} from 'redux';


export function useRemoveAllFlashErrors(dispatch: Dispatch, errors?: Array<IError>): void {
    let stateErrors;
    if(errors){
        stateErrors = errors;
    } else {
        stateErrors = useGetErrors();
    }

    stateErrors.forEach(error => {
        const fieldTerms: IErrorTerm | undefined = errorsTerms.find(
            e => e.type === error.type
                && e.field === error.field
                && e.severity === error.severity
                && e.subType === error.sub_type
                && e.showType === errorShowType.flash
        );
        if(fieldTerms) {
            dispatch(actionRemoveError(error));
        }
    });
}
