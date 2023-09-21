import {getOrderInitialData} from '@boldcommerce/checkout-frontend-library';
import {getLanguageBlob} from 'src/utils/getLanguageBlob';
import {Constants} from 'src/constants';

export function getErrorTermFromLibState(section: string, term: string): string {
    const {supported_languages: supportedLanguages} = getOrderInitialData();
    const language = supportedLanguages.find(o => o.is_default) || supportedLanguages[0];
    const blob = getLanguageBlob(language, Constants.LANGUAGE_BLOB_ERROR_TYPE);
    return blob?.[section]?.[term] || '';
}
