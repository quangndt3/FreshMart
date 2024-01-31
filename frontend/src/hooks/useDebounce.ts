import { useEffect, useState } from 'react';

function useDebounce(value : string, delay : number) {
    const [debounceValue, setDebounceValue] = useState(value);

    useEffect(() => {
        const event = setTimeout(() => {
            setDebounceValue(value);
        }, delay);

        return () => clearTimeout(event);
        // eslint-disable-next-line
    }, [value]);

    return debounceValue;
}

export default useDebounce;