import * as getTerm from 'src/utils/getTerm';
import {render} from '@testing-library/react';
import {ShippingAddress} from 'src/components';
import {Provider} from 'react-redux';
import * as Store from 'src/store';

const store = Store.initializeStore();
describe('Testing ShippingAddress component', () => {
    let getTermSpy: jest.SpyInstance;
    const calledOnce = 1;
    beforeEach(() =>{
        jest.resetAllMocks();
        getTermSpy = jest.spyOn(getTerm, 'getTerm').mockReturnValue('');
    });

    test('Render the Address properly', () => {
        const {container} = render(<Provider store={store}><ShippingAddress/></Provider>);
        expect(container.getElementsByClassName('shipping-address').length).toBe(calledOnce);
        expect(container.getElementsByClassName('address').length).toBe(calledOnce);

    });

});
