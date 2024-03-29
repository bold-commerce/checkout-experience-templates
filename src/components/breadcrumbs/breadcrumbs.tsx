import React from 'react';
import {useHistory} from 'react-router-dom';
import {IBreadcrumbsProps} from 'src/types';
import classNames from 'classnames';
import {getBreadcrumbs} from 'src/utils';
import {SupportedLanguages} from 'src/components';
import {useScreenBreakpoints} from 'src/hooks';

export function Breadcrumbs(props: IBreadcrumbsProps): React.ReactElement {
    const {active}  = props;
    const {isMobile} = useScreenBreakpoints();
    const history = useHistory();
    let breadcrumbIndex = 1;

    let crumbs = props?.crumbs || [];
    let sectionLabel = props?.sectionLabel || '';

    if (!props?.crumbs && !props?.sectionLabel) {
        const breadcrumbs = getBreadcrumbs(history, active);
        crumbs = breadcrumbs.crumbs;
        sectionLabel = breadcrumbs.sectionLabel;
    }

    return (
        <div className='navigation__container'>
            <nav className="Breadcrumb" aria-label={sectionLabel}>
                <ul className="Breadcrumb__List">
                    {
                        crumbs.map(crumb => {
                            breadcrumbIndex++;
                            const isActive = crumb.status === 'active';
                            const isCompleted = crumb.status === 'completed';
                            const isNext = crumb.status === 'next';
                            const isUpcoming = crumb.status === 'upcoming';
                            const cssClass = classNames(['Breadcrumb__Item', {
                                'Breadcrumb__Item--active': isActive,
                                'Breadcrumb__Item--next': isNext,
                                'Breadcrumb__Item--upcoming': isUpcoming,
                            }]);
                            return (
                                <li key={crumb.name} className={cssClass} >
                                    {isCompleted ?
                                        <a className="Breadcrumb__Item--completed" onClick={crumb.onClick} href={'#breadcrumb'}>
                                            {crumb.text}
                                        </a> :
                                        <span className="Breadcrumb__Item--disabled">
                                            {crumb.text}
                                        </span>
                                    } {breadcrumbIndex <= crumbs.length ? <span className='Breadcrumb_Item_Divider'>&nbsp;</span> : ''}
                                </li>
                            );
                        })
                    }
                </ul>
            </nav>
            {!isMobile && <SupportedLanguages />}
        </div>
    );
}
