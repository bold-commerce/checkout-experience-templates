import {loadJS} from '@boldcommerce/checkout-express-pay-library';
import {metaOnLoadScript} from 'src/themes/flow-sdk/meta';
import {META_SDK_URL} from 'src/themes/flow-sdk/constants';

export const initMetaFlow = async (): Promise<void> => {
    await loadJS(META_SDK_URL, metaOnLoadScript);
};