import {initialDataMock} from 'src/mocks';
import {getTerm} from 'src/utils';
import {mocked} from 'jest-mock';
import {formatPaymentLine} from 'src/utils';


jest.mock('src/utils/getTerm');
const getTermMock = mocked(getTerm, true);

describe('Test formatPaymentLine function', () => {

    const basePayment = {...initialDataMock.application_state.payments[0]};
    const amazonPayment = {...basePayment};
    amazonPayment.tag = 'amazon';
    amazonPayment.lineText= 'TEST';
    const amazonPaymentWithNoLineText = {...basePayment};
    amazonPaymentWithNoLineText.tag = 'amazon';
    amazonPaymentWithNoLineText.lineText= undefined;

    const creditPayment = {...basePayment};
    creditPayment.tag = 'Credit';
    creditPayment.friendly_brand = 'Visa';

    const creditPaymentWithBrand = {...basePayment};
    creditPaymentWithBrand.tag = 'Credit';
    creditPaymentWithBrand.friendly_brand= undefined;
    creditPaymentWithBrand.brand = 'Visa';

    const creditPaymentWithEmptyBrand = {...basePayment};
    creditPaymentWithEmptyBrand.tag = 'Credit';
    creditPaymentWithEmptyBrand.friendly_brand= undefined;
    creditPaymentWithEmptyBrand.brand = undefined;

    const giftPayment = {...basePayment};
    giftPayment.tag = 'BoldGiftCard';

    const defaultPayment = {...basePayment};
    defaultPayment.tag = 'TEST';
    defaultPayment.lineText= 'Default-Test';

    const defaultPaymentWithNoLineText = {...basePayment};
    defaultPaymentWithNoLineText.tag = 'TEST';
    defaultPaymentWithNoLineText.lineText= undefined;

    const dataArray = [
        {
            line: amazonPayment,
            result: amazonPayment.lineText
        },
        {
            line: amazonPaymentWithNoLineText,
            result: ''
        },
        {
            line: creditPayment,
            result: creditPayment.friendly_brand
        },
        {
            line: creditPaymentWithBrand,
            result: creditPayment.brand
        },
        {
            line: giftPayment,
            result: 'Gift card'
        },
        {
            line: defaultPayment,
            result: defaultPayment.lineText
        },
        {
            line: defaultPaymentWithNoLineText,
            result: ''
        },
        {
            line: creditPaymentWithEmptyBrand,
            result: ''
        }
    ];


    test.each(dataArray)( '$name', async ({line, result}) => {
        getTermMock.mockReturnValueOnce('Gift card');

        const resultText = formatPaymentLine(line);
        expect(resultText).toBe(result);

    });

});
