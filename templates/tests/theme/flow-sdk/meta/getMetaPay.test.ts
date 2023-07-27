import { getMetaPay, MetaPayNullStateError } from 'src/themes/flow-sdk/meta/getMetaPay';
import { metaFlow } from 'src/themes/flow-sdk/flowState';

describe('getMetaPay', () => {
    afterEach(() => {
        metaFlow.metaPay = null;
    });

    it('should throw MetaNullStateKeyError if metaPay is null', () => {
        expect(() => getMetaPay()).toThrowError(MetaPayNullStateError);
    });

    it('should return the metaPay object if it is not null', () => {
        const mockMetaPay = {
            PaymentClient: Object.assign(jest.fn(), { message: "Some Message" }),
            PaymentError: Object.assign(jest.fn(), { message: "Some Error Message" })
        };

        metaFlow.metaPay = mockMetaPay;

        expect(getMetaPay()).toBe(mockMetaPay);
    });
});