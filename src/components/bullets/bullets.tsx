import React from 'react';
import {Constants, CreditBrandedCardsBrand} from 'src/constants';
import {getTerm} from 'src/utils';
import {IBulletsProps} from 'src/types';
import classNames from 'classnames';

export function Bullets({brand, lineText}: IBulletsProps): React.ReactElement {
    const amexCards = CreditBrandedCardsBrand.AMEX_CARDS;
    const visaCards = CreditBrandedCardsBrand.VISA_CARDS;
    const mastercardCards = CreditBrandedCardsBrand.MASTERCARD_CARDS;
    let bulletsList = '';
    const endingWithString = getTerm('ending_with', Constants.PAYMENT_INFO);

    const lowerCaseBrand = brand.toLowerCase();
    if (amexCards.includes(lowerCaseBrand)) {
        bulletsList = '••••• •••••• ';
    } else if (visaCards.includes(lowerCaseBrand) || mastercardCards.includes(lowerCaseBrand)) {
        bulletsList = '•••• •••• •••• ';
    }
    const brandString = `${brand}${lineText !== '' ? ': ' : ''}`;

    if (brand !== '') {
        return (
            <div className={'card-type'}>
                <span className={'card-type__brand-name'}>{brandString}</span>
                {lineText !== '' && bulletsList !== '' && <span className={'card-type__bullets'} aria-hidden={true}>{bulletsList}</span>}
                {lineText !== '' && <span className={classNames(['card-type__ending-in', 'a11y-screen-reader-only'])}>{endingWithString}</span>}
                {lineText !== '' && <span className={'card-type__last-four-digits'}>{lineText}</span>}
            </div>
        );
    } else {
        return (
            <div className={'card-type'}>
                {lineText !== '' && <span className={classNames(['card-type__ending-in', 'a11y-screen-reader-only'])}>{endingWithString}</span>}
                {lineText !== '' && <span className={'card-type__last-four-digits'}>{lineText}</span>}
            </div>
        );
    }
}
