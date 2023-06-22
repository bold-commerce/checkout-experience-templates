import {ITitle} from 'src/types';
import React from 'react';
import {HeaderLogo, SupportedLanguages, Title} from 'src/components';
import classNames from 'classnames';
import {useScreenBreakpoints} from 'src/hooks';

export function Header(props: ITitle): React.ReactElement {
    const {isMobile} = useScreenBreakpoints();
    const headerLogoUrl = window.headerLogoUrl;

    return(
        <header className={classNames([
            props.isMobile ? 'main-header-mobile' : 'main-header',
            headerLogoUrl && 'main-header__logo'
        ])}>
            {isMobile && <SupportedLanguages/>}
            {headerLogoUrl 
                ? <HeaderLogo />
                : <Title/>
            }
            {!isMobile && <SupportedLanguages />}
        </header>
    );
}
