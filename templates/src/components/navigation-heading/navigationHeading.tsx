import classNames from 'classnames';
import React from 'react';
import {INavigationHeadingProps} from 'src/types';

export function NavigationHeading(props: INavigationHeadingProps): React.ReactElement {
    const {className, text, navigation, secondary} = props;
    return (
        <div className={classNames('nav-heading', className)}>
            <h3 className='nav-heading__title'>
                { navigation ?
                    <a className='nav-heading__navigation' data-testid='navigation' onClick={navigation} href="#navigation">{text}</a> :
                    <>{text}</>
                }
            </h3>
            {secondary}    
        </div>
    );
}
