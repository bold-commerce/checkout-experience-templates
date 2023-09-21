import {IApiErrorResponse} from '@boldcommerce/checkout-frontend-library';
import {IErrorTerm} from 'src/types';
import {IMetaPaymentDataError} from 'src/themes/flow-sdk/types';
import {errorsTerms} from 'src/constants';
import {MetaFields} from 'src/themes/flow-sdk/constants';
import {getErrorTermFromLibState} from 'src/utils/getErrorTermFromLibState';

export function getErrorWithField(errors: IApiErrorResponse[] = [], paymentError: IMetaPaymentDataError): IMetaPaymentDataError {
    const error = errors[0]; // Meta only accepts one error, and so we grab the first
    const fieldTerms: IErrorTerm | undefined = errorsTerms.find(
        e => e.type === error?.type
            && e.field === error?.field
            && e.severity === error?.severity
            && e.subType === error?.sub_type
    );
    const field = error?.field ? MetaFields[error?.field] : undefined;
    const message = fieldTerms ? getErrorTermFromLibState(fieldTerms?.section, fieldTerms?.term) : '';

    return field ? {...paymentError, message, field} : {...paymentError, message};
}