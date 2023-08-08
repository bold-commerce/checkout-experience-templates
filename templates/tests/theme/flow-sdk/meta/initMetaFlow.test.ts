import { initMetaFlow } from 'src/themes/flow-sdk/meta/initMetaFlow';
import { loadJS } from '@boldcommerce/checkout-express-pay-library';
import { META_SDK_URL } from 'src/themes/flow-sdk/constants';

jest.mock('@boldcommerce/checkout-express-pay-library');

describe('initMetaFlow', () => {
    it('should call loadJS with META_SDK_URL and metaOnLoadScript', async () => {
        await initMetaFlow();

        expect(loadJS).toHaveBeenCalledWith(META_SDK_URL, expect.any(Function));
    });
});