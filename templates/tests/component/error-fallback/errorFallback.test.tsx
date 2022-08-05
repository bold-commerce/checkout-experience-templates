import {render} from '@testing-library/react';
import React from 'react';
import {ErrorFallback} from 'src/components';
import {mocked} from 'jest-mock';
import {useGetErrorFallback} from 'src/hooks';
import {storeMock} from 'src/mocks';


jest.mock('src/hooks/useGetErrorFallback');
const useGetErrorFallbackMock = mocked(useGetErrorFallback, true);
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(storeMock)),
    useDispatch: () => mockDispatch
}));


test('ErrorFallback exists', () => {
    const { container } = render(<ErrorFallback/>);
    expect(useGetErrorFallbackMock).toHaveBeenCalledTimes(1);
    expect(container.getElementsByClassName('App').length).toBe(1);
    expect(container.getElementsByClassName('error-fallback').length).toBe(1);
    expect(container.getElementsByClassName('overlay__message').length).toBe(1);
});


