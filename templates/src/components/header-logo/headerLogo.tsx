import classNames from 'classnames';
import React from 'react';
import {useGetShopUrlFromShopAlias} from 'src/hooks';
import {getShopDomain} from 'src/utils';

export function HeaderLogo(): React.ReactElement {
    const shopDomain = getShopDomain();
    const shopURL = useGetShopUrlFromShopAlias(shopDomain);

    return (
        <a href={shopURL} className={classNames(['website-title-logo-clickable', 'website-title-clickable__black'])}>
            <img src={window.headerLogoUrl} className={'website-title-logo'}/>
        </a>
    );
}
