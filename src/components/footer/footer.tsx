import React from 'react';
import ClassNames from 'classnames';

import {useGetFooter, useGetLifeFields} from 'src/hooks';
import {LifeInputLocationConstants} from 'src/constants';
import {LifeFields} from 'src/components';

export function Footer(): React.ReactElement {
    const {shopAlias, footerRights} = useGetFooter();
    const cssClass = ClassNames(['footer', 'footer--border-bottom']);
    const belowActionsLifeFields  = useGetLifeFields(LifeInputLocationConstants.BELOW_ACTIONS);
    const belowActionsLifeFieldsClassNames = ClassNames(['footer--life-fields', 'below-actions-life-elements']);

    return (
        <footer className={cssClass}>
            <p className={'footer--disclaimer'}>{`${footerRights} ${shopAlias}`}</p>
            <LifeFields className={belowActionsLifeFieldsClassNames} lifeFields={belowActionsLifeFields}/>
        </footer>
    );
}
