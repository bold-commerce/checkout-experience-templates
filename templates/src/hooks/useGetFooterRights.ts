import {Constants} from 'src/constants';
import {IUseFooterRights} from 'src/types';
import {getTerm} from 'src/utils';

export function useGetFooterRights(): IUseFooterRights {
    const {shopAlias: wShopAlias, shopName: wShopName} = window;
    const shopAlias = wShopName ? wShopName : (wShopAlias ? wShopAlias : '');
    const footerRights= getTerm('footer_rights', Constants.GLOBAL_INFO, undefined, 'All rights reserved');

    return {
        shopAlias,
        footerRights
    };
}
