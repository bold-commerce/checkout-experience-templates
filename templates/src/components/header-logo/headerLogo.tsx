import React from 'react';
import {useGetShopUrlFromShopAlias} from 'src/hooks';

export function HeaderLogo(): React.ReactElement {
    const shopAlias = window.shopAlias;
    const headerLogoUrl = window.headerLogoUrl;
    const shopURL = useGetShopUrlFromShopAlias(shopAlias);

    return (
        <>
            {headerLogoUrl ?
                <div className={'website-title-logo-clickable'}>
                    <div className={'website-title-clickable__logo'}>
                        <a href={shopURL} className={'website-title-clickable__black'}>
                            <img src={headerLogoUrl} className={'website-title-logo'}/>
                        </a>
                    </div>
                </div> : ''
            }
        </>
    );
}
