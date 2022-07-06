import {IError, IErrorTerm} from 'src/types';
import {errorShowType, errorsTerms} from 'src/constants';

export function isOnlyFlashError(errors: IError[]): boolean {
    let result = true;
    errors.forEach(error => {
        const fieldTerms: IErrorTerm | undefined = errorsTerms.find(e =>
            e.type === error.type &&
            e.field === error.field &&
            e.severity === error.severity &&
            e.subType === error.sub_type &&
            e.showType !== errorShowType.flash &&
            e.showType !== errorShowType.discountFlash
        );
        if(fieldTerms){
            result = false;
        }
    });

    return result;
}
