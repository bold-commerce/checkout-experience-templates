import React, {useMemo} from 'react';
import ClassNames from 'classnames';
import {IFieldSectionProps} from 'src/types';

export function FieldSection(props: React.PropsWithChildren<IFieldSectionProps>): React.ReactElement {

    const cssClass = useMemo(() =>  ClassNames([
        'field-section',
        props.className
    ]) , [props.className]);
    return (
        <section className={cssClass} >
            <div className={ClassNames('field-section__header', {'field--Hidden': !props.showTitle})}>
                <h2 className="field-section__heading">{ props.title }</h2>
                { props.accessory ? <div className="field-section__accessory">{ props.accessory }</div> : null}
            </div>
            <div className="field-section__content">
                { props.children }
            </div>
        </section>
    );
}
