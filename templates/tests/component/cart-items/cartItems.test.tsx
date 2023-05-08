import {ICartItemsProps} from 'src/types';
import {initialDataMock, stateMock} from 'src/mocks';
import {render} from '@testing-library/react';
import {CartItems} from 'src/components';
import {mocked} from 'jest-mock';
import {useGetCurrencyInformation} from 'src/hooks';
import {ILineItem} from '@boldcommerce/checkout-frontend-library';

const store = {
    data: initialDataMock
};

jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store))
}));
jest.mock('src/hooks/useGetCurrencyInformation');
const useGetCurrencyInformationMock = mocked(useGetCurrencyInformation, true);

describe('Testing CartItems component', () => {
    const lineItems: Array<ILineItem> = stateMock.data.application_state.line_items;
    const props: ICartItemsProps = {
        line_items: lineItems
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useGetCurrencyInformationMock.mockReturnValueOnce({formattedPrice: '${{amount}}', currency: 'CAD', currencySymbol: '$'})
    });

    test('rendering the component successfully', () => {
        const {container} = render(<CartItems {...props}/>);
        expect(container.getElementsByClassName('cart-items').length).toBe(1);
        expect(container.getElementsByClassName('cart-item').length).toBe(lineItems.length);
    });

});
