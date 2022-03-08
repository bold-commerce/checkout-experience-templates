import {Button} from '@boldcommerce/stacks-ui';
import ClassNames from 'classnames';
import React from 'react';

import {ContactUs, FooterRights} from 'src/components';
import {IFooterProps} from 'src/types';

export function Footer(props: IFooterProps): React.ReactElement {
    const showBackLink = !!props.backLinkText && !!props.backLinkOnClick;
    const cssClass  = ClassNames(['footer', props.className]);
    const cssClassButton  = ClassNames(['footer__continue-button', 'btn-checkout']);

    return (
        <div className={cssClass}>
            <div className={'footer__button-container'}>
                {props.contactUs && <ContactUs/>}
                {showBackLink &&
                <a className={'footer__back-link'} href={'#footerBack'} onClick={props.backLinkOnClick}>
                    {props.backLinkText}
                </a>
                }
                <div className={'footer__button'}>
                    <Button
                        size={'large'}
                        loading={props.nextButtonLoading}
                        disabled={props.nextButtonDisable}
                        className={cssClassButton}
                        onClick={props.nextButtonOnClick}>{props.nextButtonText}
                    </Button>
                </div>
            </div>
            <FooterRights/>
        </div>
    );
}
