import {initialDataMock, stateMock} from 'src/mocks';
import {fireEvent, render} from '@testing-library/react';
import {CartItem, SemiControlledNumberInput} from 'src/components';
import { mocked } from 'jest-mock';
import { getLineItemPropertiesForDisplay } from 'src/utils';
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
jest.mock('src/components/semi-controlled-number-input/semiControlledNumberInput');
jest.mock('src/utils', () => ({
    ... jest.requireActual('src/utils'),
    getLineItemPropertiesForDisplay: jest.fn()
}))

const SemiControlledNumberInputMock = mocked(SemiControlledNumberInput);
const getLineItemPropertiesForDisplayMock = mocked(getLineItemPropertiesForDisplay, true);

describe('Testing CartItem component', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        getLineItemPropertiesForDisplayMock.mockReturnValueOnce(['properties: value']);
        useGetCurrencyInformationMock.mockReturnValue({formattedPrice: '${{amount}}', currency: 'CAD', currencySymbol: '$'})
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.useRealTimers();
    });

    const lineItem: ILineItem = stateMock.data.application_state.line_items[0];
    const lineItemVariant: ILineItem = {
        ...lineItem,
        product_data: {
            ...lineItem.product_data,
            title: 'Variant Title'
        }
    };
    const lineItemWithVariantAndProperties: ILineItem = {
        ...lineItem,
        product_data: {
            ...lineItem.product_data,
            title: 'Variant Title',
            properties: {'property': 'value'}
        }
    }
    const lineItemWithProperties: ILineItem = {
        ...lineItem,
        product_data: {
            ...lineItem.product_data,
            properties: {'property': 'value'}
        }
    }

    const dataArray = [
        {
            name: 'rendering the cart item component without variant',
            props: { line_item: lineItem, showLineItemProperties: false  },
            counters: { variant_title: 0, properties: 0 }
        }, {
            name: 'rendering the cart item component with a variant',
            props: { line_item: lineItemVariant, showLineItemProperties: false  },
            counters: { variant_title: 1, properties: 0 }
        }, {
            name: 'rendering the cart item component with line item properties',
            props: { line_item: lineItemWithProperties, showLineItemProperties: true },
            counters: { variant_title: 0, properties: 1 }
        }, {
            name: 'rendering the cart item component with a variant and line item properties',
            props: { line_item: lineItemWithVariantAndProperties, showLineItemProperties: true },
            counters: { variant_title: 1, properties: 1 }
        }
    ]

    test.each(dataArray)('$name', ({counters, props}) => {
        const {container} = render(<CartItem {...props}/>);
        expect(container.getElementsByClassName('cart-item').length).toBe(1);
        expect(container.getElementsByClassName('cart-item__text').length).toBe(1);
        expect(container.getElementsByClassName('cart-item__title').length).toBe(1);
        expect(container.getElementsByClassName('cart-item__variant-title').length).toBe(counters.variant_title);
        expect(container.getElementsByClassName('cart-item__property').length).toBe(counters.properties);
        expect(container.getElementsByClassName('cart-item__price-quantity').length).toBe(1);
        expect(container.getElementsByClassName('cart-item__quantity-container').length).toBe(1);
        expect(container.getElementsByClassName('cart-item__quantity').length).toBe(1);
        expect(container.getElementsByClassName('cart-item__quantity-number').length).toBe(1);
        expect(container.getElementsByClassName('cart-item__price').length).toBe(1);
        expect(container.getElementsByClassName('cart-item__quantity-controls').length).toBe(0);
    });

    test('rendering the cart item with quantity selector', () => {
        SemiControlledNumberInputMock.mockImplementation(() => <div data-testid="test-input" />);
        const { container, getByTestId } = render(<CartItem line_item={lineItem} onUpdateQuantity={jest.fn()} />);

        expect(container.getElementsByClassName('cart-item__quantity-controls').length).toBe(1);
        expect(getByTestId('test-input')).toBeTruthy();
    });

    test('updating the local quantity and submitting the quantity', () => {
        let onCommit: (qty: number) => void = jest.fn();
        SemiControlledNumberInputMock.mockImplementation((props) => {
            onCommit = props.onCommit;
            return <div data-testid="test-input" />;
        });
        getLineItemPropertiesForDisplayMock.mockReturnValue([]);
        const onUpdateQuantity = jest.fn();
        const _lineItem: ILineItem = {
            ...lineItem,
            product_data: {
                ...lineItem.product_data,
                quantity: 1,
            }
        };

        const { container } = render(<CartItem line_item={_lineItem} onUpdateQuantity={onUpdateQuantity} />);
        const [ incrementButton ] = container.getElementsByClassName('cart-item__quantity-increase');
        const [ decrementButton ] = container.getElementsByClassName('cart-item__quantity-decrease');
        expect(incrementButton).toBeTruthy();
        expect(decrementButton).toBeTruthy();

        // Testing incrememnting and decrementing should not all onUpdateQuantity
        fireEvent.click(incrementButton);
        fireEvent.click(decrementButton);
        jest.runAllTimers();
        expect(onUpdateQuantity).not.toHaveBeenCalled();

        // Testing incrementing and letting the debounce happen should call onUpdateQuantity
        fireEvent.click(incrementButton);
        jest.runAllTimers();
        expect(onUpdateQuantity).toBeCalledTimes(1);
        expect(onUpdateQuantity).toBeCalledWith(_lineItem.product_data.line_item_key, 2);

        // Testing calling commit from the <SemiControlledNumberInput />
        onCommit(2);
        expect(onUpdateQuantity).toBeCalledTimes(2);
    });
});
