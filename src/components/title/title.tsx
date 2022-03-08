import React from 'react';
import classNames from 'classnames';
import {useGetShopUrlFromShopAlias} from 'src/hooks';

export function Title(): React.ReactElement {
    const shopAlias = window.shopAlias;
    const shopName = window.shopName;
    const shopURL = useGetShopUrlFromShopAlias(shopAlias);

    return (
        <div className={'website-title'}>
            <div className={'website-title-clickable'}>
                <div className={'website-title-clickable__site-name'}>
                    <a href={shopURL} className={classNames(['website-title-clickable__black-text'])}>
                        {shopName}
                    </a>
                </div>
            </div>
        </div>
    );
}
