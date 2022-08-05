import {render} from '@testing-library/react';
import {mocked} from 'jest-mock';
import {Provider} from 'react-redux';
import {ShippingAddress} from 'src/components';
import * as Store from 'src/store';
import {getTerm} from 'src/utils';

const store = Store.initializeStore();
jest.mock('src/utils');
const getTermMock = mocked(getTerm, true);

describe('Testing ShippingAddress component', () => {

    beforeEach(() =>{
        jest.resetAllMocks();
        getTermMock.mockReturnValue('');
    });

    test('Render the Address properly', () => {
        const {container} = render(<Provider store={store}><ShippingAddress/></Provider>);
        expect(container.getElementsByClassName('shipping-address').length).toBe(1);
        expect(container.getElementsByClassName('address').length).toBe(1);

    });
});
