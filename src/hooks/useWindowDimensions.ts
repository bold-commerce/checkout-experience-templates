import {useEffect} from 'react';
import {actionUpdateScreenWidth} from 'src/action';
import {useDispatch} from 'react-redux';

export function useWindowDimensions(): void {
    const dispatch = useDispatch();
    useEffect(() => {
        function handleResize() {
            dispatch(actionUpdateScreenWidth(window.innerWidth));
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
}
