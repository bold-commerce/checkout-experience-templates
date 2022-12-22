import React from 'react';
import classNames from 'classnames';
import {useGetShopUrlFromShopAlias} from 'src/hooks';
import {getShopDomain} from 'src/utils';

export function Title(): React.ReactElement {
    const shopDomain = getShopDomain();
    const shopName = window.shopName;
    const shopURL = useGetShopUrlFromShopAlias(shopDomain);

    return (
        <h1 className={'website-title'}>
            <div className={'website-title-clickable'}>
                <div className={'website-title-clickable__site-name'}>
                    <a href={shopURL} className={classNames(['website-title-clickable__black-text'])}>
                        {shopName}
                    </a>
                </div>
            </div>
        </h1>
    );
}
