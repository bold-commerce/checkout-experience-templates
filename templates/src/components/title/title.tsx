import React from 'react';
import {useGetShopUrlFromShopAlias} from 'src/hooks';
import {getShopDomain} from 'src/utils';

export function Title(): React.ReactElement {
    const shopDomain = getShopDomain();
    const shopName = window.shopName;
    const shopURL = useGetShopUrlFromShopAlias(shopDomain);

    return (
        <h1 className={'website-title'}>
            <a href={shopURL} className={'website-title-clickable__black-text'}>
                {shopName}
            </a>
        </h1>
    );
}
