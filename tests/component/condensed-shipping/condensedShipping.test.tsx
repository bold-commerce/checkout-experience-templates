import { render } from '@testing-library/react';
import { CondensedShipping } from 'src/components';
import { getTerm } from 'src/utils';
import { mocked } from 'jest-mock';
import { addressMock, emptyAddressMock } from 'src/mocks';
import { useGetSelectShippingLine } from 'src/hooks';
import {initialDataMock} from 'src/mocks';

const store = {
    data: initialDataMock
};

jest.mock('src/hooks/rootHooks');
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store))
}));

jest.mock('src/utils/getTerm');
jest.mock('src/hooks/useGetSelectShippingLine');
const getTermMock = mocked(getTerm, true);
const useGetSelectShippingLineMock = mocked(useGetSelectShippingLine, true);

describe('Testing condensedShipping component', () => {
    const getTermValue = 'test term';
    const selectShippingLineValue = {
        id: '1',
        amount: 99,
        description: 'test shipping'
    }

    beforeEach(() => {
        jest.clearAllMocks();
        useGetSelectShippingLineMock.mockReturnValue(selectShippingLineValue);
    })

    const dataArray = [
        {
            name: 'Rendering Condensed Shipping without address',
            props: { address: emptyAddressMock },
            counters: {
                condensed_shipping: 1,
                condensed_shipping__name: 0,
                condensed_shipping__address: 0,
                condensed_shipping__phone: 0,
                condensed_shipping__method: 0
            }
        },{
            name: 'Rendering Condensed Shipping successfully',
            props: { address: addressMock },
            counters: {
                condensed_shipping: 1,
                condensed_shipping__name: 1,
                condensed_shipping__address: 1,
                condensed_shipping__phone: 0,
                condensed_shipping__method: 0
            }
        },{
            name: 'Rendering Condensed Shipping with shipping method',
            props: { address: addressMock, showMethod: true },
            counters: {
                condensed_shipping: 1,
                condensed_shipping__name: 1,
                condensed_shipping__address: 1,
                condensed_shipping__phone: 0,
                condensed_shipping__method: 1
            }
        },{
            name: 'Rendering Condensed Shipping with phone number',
            props: { address: addressMock, showPhone: true },
            counters: {
                condensed_shipping: 1,
                condensed_shipping__name: 1,
                condensed_shipping__address: 1,
                condensed_shipping__phone: 1,
                condensed_shipping__method: 0
            }
        }
    ];

    test.each(dataArray)('$name', ({counters, props}) => {
        const { container } = render(<CondensedShipping {...props} />);

        expect(container.getElementsByClassName('condensed-shipping').length).toBe(counters.condensed_shipping);
        expect(container.getElementsByClassName('condensed-shipping__name').length).toBe(counters.condensed_shipping__name);
        expect(container.getElementsByClassName('condensed-shipping__address').length).toBe(counters.condensed_shipping__address);
        expect(container.getElementsByClassName('condensed-shipping__phone').length).toBe(counters.condensed_shipping__phone);
        expect(container.getElementsByClassName('condensed-shipping__method').length).toBe(counters.condensed_shipping__method);
    });


    test('Rendering Condensed Shipping translation', () => {
        getTermMock.mockReturnValue(getTermValue);
        const { container } = render(<CondensedShipping address={emptyAddressMock} />);

        expect(container.firstElementChild?.firstElementChild?.innerHTML).toBe(getTermValue)
    });

});
