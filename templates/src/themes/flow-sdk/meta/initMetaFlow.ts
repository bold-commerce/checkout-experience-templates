import {loadJS} from '@boldcommerce/checkout-express-pay-library';
import {metaOnLoadScript} from 'src/themes/flow-sdk/meta';
import {META_SDK_URL} from 'src/themes/flow-sdk/constants';

export async function initMetaFlow(): Promise<void> {
    return await loadJS(META_SDK_URL, metaOnLoadScript);
}
