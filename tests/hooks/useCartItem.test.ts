import { stateMock} from 'src/mocks';
import {ILineItem} from '@boldcommerce/checkout-frontend-library';
import {renderHook} from '@testing-library/react-hooks';
import {useCartItem} from 'src/hooks';
import { act } from "react-dom/test-utils";

describe('Testing seCartItem hook', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.useRealTimers();
    });

    const lineItem: ILineItem = stateMock.data.application_state.line_items[0];

    test('testing click is prevented when increment quantity button is disabled', async () => {
        const _lineItem: ILineItem = {
            ...lineItem,
            product_data: {
                ...lineItem.product_data,
                quantity: 1,
            }
        };
        const quantityDisabled = true;

        const {result} = renderHook(() => useCartItem(_lineItem, quantityDisabled));
        const hookResult = result.current;
  
        const event = {
            currentTarget: document.createElement('button'),
            preventDefault: jest.fn(),
        } as unknown as React.MouseEvent<HTMLButtonElement, MouseEvent>;

        act(() => {
            hookResult.incrementQuantity(event);
          });
        expect(event.preventDefault).toBeCalled();    
    });

    test('testing click is prevented when decrement quantity button is disabled', async () => {
        const _lineItem: ILineItem = {
            ...lineItem,
            product_data: {
                ...lineItem.product_data,
                quantity: 1,
            }
        };
        const quantityDisabled = true;

        const {result} = renderHook(() => useCartItem(_lineItem, quantityDisabled));
        const hookResult = result.current;
  
        const event = {
            currentTarget: document.createElement('button'),
            preventDefault: jest.fn(),
        } as unknown as React.MouseEvent<HTMLButtonElement, MouseEvent>;

        act(() => {
            hookResult.decrementQuantity(event);
          });
        expect(event.preventDefault).toBeCalled();    
    });
});
