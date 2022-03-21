import React from 'react';
import ClassNames from 'classnames';
import { ICloseableHeaderProps } from 'src/types';

export function CloseableHeader(props: ICloseableHeaderProps): React.ReactElement {
    const { className, title, onClose } = props;

    return (
        <div className={ClassNames(className, 'closeable-header')}>
            <span className='closeable-header__title'>{title}</span>
            <button className='closeable-header__button' data-testid='closeable-header' onClick={onClose}></button>
        </div>
    );
}
