import React from 'react';
import ClassNames from 'classnames';
import { ICloseableHeaderProps } from 'src/types';

export function CloseableHeader(props: ICloseableHeaderProps): React.ReactElement {
    const { className, title, onClose } = props;

    return (
        <div className={ClassNames(className, 'closeable-header')}>
            <h1 className='closeable-header__title'>{title}</h1>
            <button className='closeable-header__button' data-testid='closeable-header' onClick={onClose} aria-label="Close"></button>
        </div>
    );
}
