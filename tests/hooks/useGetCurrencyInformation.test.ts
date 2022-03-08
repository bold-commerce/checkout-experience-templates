import {renderHook} from '@testing-library/react-hooks';
import {useGetCurrencyInformation} from 'src/hooks';


describe('Testing useGetCurrencyInformation', () => {
    window = Object.create(window);
    window.currencySymbol = '$';
    window.currency= 'USD';
    
    test('Rendering the hook properly', () => {
        const {result} = renderHook(() => useGetCurrencyInformation());
        expect(result.current.currencySymbol).toStrictEqual('$');
        expect(result.current.currency).toStrictEqual('USD');
    });
});
