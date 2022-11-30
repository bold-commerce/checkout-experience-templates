import {render} from '@testing-library/react';
import {mocked} from 'jest-mock';
import React from 'react';
import {storeMock} from 'src/mocks';
import {LoginPrompt} from 'src/components';
import {getTerm} from 'src/utils';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(storeMock)),
    useDispatch: () => mockDispatch
}));
jest.mock('src/utils');
const getTermMock = mocked(getTerm, true);

describe('Testing LoginPrompt component', () => {

    test('Render the FieldSection properly', () => {
        const {container} = render(<LoginPrompt/>);
        expect(container.getElementsByClassName('LoginPrompt').length).toBe(1);
        expect(getTermMock).toHaveBeenCalledTimes(2);
        expect(container.getElementsByTagName('a').length).toBe(1);
    });
});
