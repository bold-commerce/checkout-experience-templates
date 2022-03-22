import {ITitle} from 'src/types';
import React from 'react';
import {HeaderLogo, SupportedLanguages, Title} from 'src/components';
import classNames from 'classnames';

export function Header(props: ITitle): React.ReactElement {
    return(
        <div className={props.isMobile ? classNames(['header-mobile']) : classNames(['header'])}>
            <HeaderLogo />
            <Title/>
            <SupportedLanguages/>
        </div>
    );
}
