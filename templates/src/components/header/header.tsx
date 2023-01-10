import {ITitle} from 'src/types';
import React from 'react';
import {HeaderLogo, SupportedLanguages, Title} from 'src/components';
import classNames from 'classnames';
import {useScreenBreakpoints} from 'src/hooks';

export function Header(props: ITitle): React.ReactElement {
    const {isMobile} = useScreenBreakpoints();

    return(
        <header className={props.isMobile ? classNames(['main-header-mobile']) : classNames(['main-header'])}>
            {isMobile && <SupportedLanguages/>}
            <HeaderLogo />
            <Title/>
            {!isMobile && <SupportedLanguages/>}
        </header>
    );
}
