import {Button} from '@boldcommerce/stacks-ui';
import classNames from 'classnames';
import React from 'react';

import {ContactUs} from 'src/components';
import {Constants} from 'src/constants';
import {IFormControlsProps} from 'src/types';
import {getTerm} from 'src/utils';

export function FormControls(props: IFormControlsProps): React.ReactElement {
    const showBackLink = !!props.backLinkText && !!props.backLinkOnClick;
    const cssClass  = classNames(['form-controls', props.className]);
    const cssClassButton  = classNames(['form-controls__button', 'form-controls__continue-button', 'btn-checkout']);
    const sectionAriaLabel = getTerm('form_controls', Constants.GLOBAL_INFO);
    const nextButtonTestDataId = props.nextButtonTestDataId ?? 'footer-return-to-store-button';

    return (
        <section className={cssClass} aria-label={sectionAriaLabel}>
            {props.contactUs && <ContactUs/>}
            {showBackLink &&
            <a data-testid={'back-link'} className={'form-controls__back-link'} href={'#footerBack'} onClick={props.backLinkOnClick}>
                <span className={'form-controls__back-link--wrapper'}>
                    {props.backLinkText}
                </span>
            </a>
            }
            <Button
                data-testid={nextButtonTestDataId}
                size={'large'}
                type='submit'
                loading={props.nextButtonLoading}
                disabled={props.nextButtonDisable}
                className={cssClassButton}
                onClick={props.nextButtonOnClick}>{props.nextButtonText}
            </Button>
        </section>
    );
}
