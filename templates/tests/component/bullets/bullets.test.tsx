import { render } from '@testing-library/react';
import { Bullets } from 'src/components';
import { getTerm } from 'src/utils';
import { mocked } from 'jest-mock';

jest.mock('src/utils/getTerm');
const getTermMock = mocked(getTerm, true);

describe('Testing condensedShipping component', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        getTermMock.mockReturnValue('some_text');
    });

    const dataArray = [
        {
            name: 'Rendering AMEX_CARDS card',
            props: { brand: 'amex', lineText: '3333' },
            expected: {
                brandName: 1,
                bullets: 1,
                lastDigits: 1
            }
        },{
            name: 'Rendering VISA_CARDS card',
            props: { brand: 'visa', lineText: '4444' },
            expected: {
                brandName: 1,
                bullets: 1,
                lastDigits: 1
            }
        },{
            name: 'Rendering MASTERCARD_CARDS card',
            props: { brand: 'mastercard', lineText: '5555' },
            expected: {
                brandName: 1,
                bullets: 1,
                lastDigits: 1
            }
        },{
            name: 'Rendering OTHER_CARDS card',
            props: { brand: 'jcb', lineText: '8888' },
            expected: {
                brandName: 1,
                bullets: 0,
                lastDigits: 1
            }
        },{
            name: 'Rendering ANY OTHER card',
            props: { brand: 'any_card', lineText: '9999' },
            expected: {
                brandName: 1,
                bullets: 0,
                lastDigits: 1
            }
        },{
            name: 'Rendering EMPTY BRAND card',
            props: { brand: '', lineText: '1111' },
            expected: {
                brandName: 0,
                bullets: 0,
                lastDigits: 1
            }
        },{
            name: 'Rendering EMPTY lineText value',
            props: { brand: 'VISA', lineText: '' },
            expected: {
                brandName: 1,
                bullets: 0,
                lastDigits: 0
            }
        }
    ];

    test.each(dataArray)('$name', ({props, expected}) => {
        const { container } = render(<Bullets {...props} />);

        expect(container.getElementsByClassName('card-type__brand-name').length).toBe(expected.brandName);
        expect(container.getElementsByClassName('card-type__bullets').length).toBe(expected.bullets);
        expect(container.getElementsByClassName('card-type__last-four-digits').length).toBe(expected.lastDigits);
    });
});
