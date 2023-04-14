import React from 'react';
import {ICondensedSectionProps} from 'src/types';
import {NavigationHeading} from 'src/components';
import ClassNames from 'classnames';

export function CondensedSection(props: ICondensedSectionProps): React.ReactElement {
    const {navigationHeadingProps, children, className} = props;
    const cssClass = ClassNames(className, 'condensed-section');

    return (
        <div className={cssClass}>
            { navigationHeadingProps && <NavigationHeading {...navigationHeadingProps} />}
            {children}
        </div>
    );
}
