import React from 'react';
import {useGetShopUrlFromShopAlias} from 'src/hooks';
import {getShopDomain} from 'src/utils';

export function HeaderLogo(): React.ReactElement {
    const shopDomain = getShopDomain();
    const headerLogoUrl = window.headerLogoUrl;
    const shopURL = useGetShopUrlFromShopAlias(shopDomain);

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
