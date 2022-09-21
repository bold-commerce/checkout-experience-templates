import {ITitle} from 'src/types';
import React from 'react';
import {HeaderLogo, SupportedLanguages, Title} from 'src/components';
import classNames from 'classnames';

export function Header(props: ITitle): React.ReactElement {
    return(
        <div className={props.isMobile ? classNames(['main-header-mobile']) : classNames(['main-header'])}>
            <HeaderLogo />
            <Title/>
            <SupportedLanguages/>
        </div>
    );
}
