import classNames from 'classnames';
import React from 'react';
import { INavigationHeadingProps } from 'src/types';

export function NavigationHeading(props: INavigationHeadingProps): React.ReactElement {
    const { className, text, navigation, secondary } = props;
    return (
        <div className={classNames('nav-heading', className)}>
            { navigation ?
                <a className='nav-heading__title' data-testid='navigation' onClick={navigation} href="#navigation">{text}</a> :
                <p>{text}</p>
            }
            {secondary}    
        </div>
    );
}
