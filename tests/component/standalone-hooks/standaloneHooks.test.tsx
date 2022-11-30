import {mocked} from 'jest-mock';
import {executeHooks} from 'src/utils';
import {render} from '@testing-library/react';
import {StandaloneHooks} from 'src/components';

jest.mock('src/utils');
const executeHooksMock = mocked(executeHooks, true);

describe('Testing StandaloneHooks component', () => {

    test('Rendering the component', () => {
        render(<StandaloneHooks/>);
        expect(executeHooksMock).toHaveBeenCalledTimes(1);
    });
});
