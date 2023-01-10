import React from 'react';
import ClassNames from 'classnames';

import {useGetFooter} from 'src/hooks';

export function Footer(): React.ReactElement {
    const {shopAlias, footerRights} = useGetFooter();
    const cssClass = ClassNames(['footer', 'footer--border-bottom']);

    return (
        <footer className={cssClass}>
            <p className={'footer--disclaimer'}>{`${footerRights} ${shopAlias}`}</p>
        </footer>
    );
}
