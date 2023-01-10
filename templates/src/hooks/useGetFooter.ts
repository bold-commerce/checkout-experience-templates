import {Constants} from 'src/constants';
import {IUseFooter} from 'src/types';
import {getTerm} from 'src/utils';

export function useGetFooter(): IUseFooter {
    const {shopAlias: wShopAlias, shopName: wShopName, customDomain: wCustomDomain} = window;
    const shopAlias = wShopName ? wShopName : (wCustomDomain ? wCustomDomain : wShopAlias ? wShopAlias : '');
    const footerRights= getTerm('footer_rights', Constants.GLOBAL_INFO, undefined, 'All rights reserved');

    return {
        shopAlias,
        footerRights
    };
}
