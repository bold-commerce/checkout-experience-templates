import {render} from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import {BuyNowContainerPage } from 'src/themes/buy-now/pages';
import { useBuyNowContainerPage } from 'src/themes/buy-now/hooks';
import React from 'react';
import { IUseBuyNowContainerPage } from 'src/themes/buy-now/types';

jest.mock('src/themes/buy-now/hooks/useBuyNowContainerPage');
jest.mock('src/themes/buy-now/pages', () => ({
    ...jest.requireActual('src/themes/buy-now/pages'),
    IndexPage: () => <div className="mockIndex"/>,
    ShippingPage: () => <div className="mockShipping"/>,
    SummaryPage: () => <div className="mockSummary"/>
}));

const useBuyNowContainerPageMock = mocked(useBuyNowContainerPage, true);

describe('testing BuyNowContainerPage', () => {

    const props: IUseBuyNowContainerPage = {
        openSection: '/',
        navigateTo: jest.fn(),
        containerStyle: {}
    };

    beforeEach(() => {
        useBuyNowContainerPageMock.mockReturnValue(props)
    });

    test('Rendering buyNowContainerPage properly', () => { 
        const {container} = render(<BuyNowContainerPage/>);

        expect(container.getElementsByClassName('checkout-experience-container').length).toBe(1);
        expect(container.getElementsByClassName('buy-now-container').length).toBe(1);
        expect(container.getElementsByClassName('mockIndex').length).toBe(1);
        expect(container.getElementsByClassName('mockShipping').length).toBe(1);
    });


});
