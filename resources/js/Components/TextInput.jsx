// --1. imports--
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

// --2. main component--
export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props }, // properties
    ref,
) {
    const localRef = useRef(null); // properties

    useImperativeHandle(ref, () => ({ // methods
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => { // trigger
        if (isFocused) { // check
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ' + // css
                className
            }
            ref={localRef} // reference
        />
    );
});
