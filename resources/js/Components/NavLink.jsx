// --1. imports--
import { Link } from '@inertiajs/react';

// --2. main component--
export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active // check
                    ? 'border-indigo-400 text-gray-900 focus:border-indigo-700' // css
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700') + // css
                className
            }
        >
            {children}
        </Link>
    );
}
