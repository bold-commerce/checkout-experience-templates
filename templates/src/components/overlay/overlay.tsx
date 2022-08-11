import React from 'react';
import {IOverlay, IOverlayProps} from 'src/types';
import {useGetOverlay} from 'src/hooks';
import ClassNames from 'classnames';
import {Button} from '@boldcommerce/stacks-ui';
import {lockUnlockScroll} from 'src/utils';

export function Overlay(props: IOverlayProps): React.ReactElement {

    const overlay: IOverlay = useGetOverlay();
    lockUnlockScroll(overlay.shown);

    const overlayId = overlay.inverted? 'overlay-inverted': 'overlay';

    const cssClassOverlay = ClassNames([
        {'overlay-hidden': !overlay.shown },
    ]);

    const cssClassButton = ClassNames([
        'overlay__button',
        {'overlay-hidden': (overlay.inverted || !overlay.buttonText)},
    ]);

    const cssClassIcon= ClassNames([
        {'overlay__icon-error-triangle': !overlay.inverted},
        {'overlay__loader': overlay.inverted},
        'overlay__icon'
    ]);

    return(
        <div data-testid='overlay-div' id={overlayId} className={cssClassOverlay}>
            {
                overlay.showCustomContent ? props.children : null
            }
            <div className={'overlay__message'}>
                <i data-testid='overlay-icon'  className={cssClassIcon}>{overlay.icon}</i>
                <h1 className={'overlay__header'}>{overlay.header}</h1>
                <h2 className={'overlay__subheader'}>{overlay.subHeader}</h2>
                <div className={'overlay__content'}>
                    <span className={'overlay__content-span'}>{overlay.content}</span>
                </div>
                <div data-testid='overlay-button' className={'overlay__button-container'} ><Button className={cssClassButton} href={window.returnUrl} size='large'>{overlay.buttonText}</Button></div>
            </div>
        </div>
    );
}
