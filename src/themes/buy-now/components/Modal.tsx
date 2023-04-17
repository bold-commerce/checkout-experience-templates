import React from 'react';
import {useModal} from 'src/themes/buy-now/hooks';
import {IModalProps} from 'src/themes/buy-now/types';
import './Modal.css';

export function Modal(props: IModalProps): React.ReactElement {
    const {isOpen} = useModal();

    return (
        <div className="buy-now__modal">
            {
                isOpen && props.children
            }
        </div>
    );
}
