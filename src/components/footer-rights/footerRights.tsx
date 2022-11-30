import React from 'react';
import ClassNames from 'classnames';

import {useGetFooterRights} from 'src/hooks';

export function FooterRights(): React.ReactElement {
    const {shopAlias, footerRights} = useGetFooterRights();
    const cssClass = ClassNames(['footer__rights', 'footer__rights--border-bottom']);

    return (
        <div className={'footer__rights-container'}>
            <span className={cssClass}>{`${footerRights} ${shopAlias}`}</span>
        </div>
    );
}
