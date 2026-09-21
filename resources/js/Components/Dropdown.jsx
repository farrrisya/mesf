// --1. imports--
import { Transition } from '@headlessui/react';
import { Link } from '@inertiajs/react';
import { createContext, useContext, useState } from 'react';

// --2. properties--
const DropDownContext = createContext(); // context

// --3. main component--
const Dropdown = ({ children }) => {
    const [open, setOpen] = useState(false); // state

    const toggleOpen = () => { // trigger
        setOpen((previousState) => !previousState);
    };

    return (
        <DropDownContext.Provider value={{ open, setOpen, toggleOpen }}>
            <div className="relative">{children}</div>
        </DropDownContext.Provider>
    );
};

// --4. sub components--
const Trigger = ({ children }) => {
    const { open, setOpen, toggleOpen } = useContext(DropDownContext); // properties

    return (
        <>
            <div onClick={toggleOpen}>{children}</div> {/* trigger */}

            {open && ( // check
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setOpen(false)} // trigger
                ></div>
            )}
        </>
    );
};

const Content = ({
    align = 'right',
    width = '48',
    contentClasses = 'py-1 bg-white',
    children,
}) => {
    const { open, setOpen } = useContext(DropDownContext); // properties

    let alignmentClasses = 'origin-top'; // css

    if (align === 'left') { // check
        alignmentClasses = 'ltr:origin-top-left rtl:origin-top-right start-0';
    } else if (align === 'right') { // check
        alignmentClasses = 'ltr:origin-top-right rtl:origin-top-left end-0';
    }

    let widthClasses = ''; // css

    if (width === '48') { // check
        widthClasses = 'w-48';
    }

    return (
        <>
            <Transition
                show={open} // check
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <div
                    className={`absolute z-50 mt-2 rounded-md shadow-lg ${alignmentClasses} ${widthClasses}`}
                    onClick={() => setOpen(false)} // trigger
                >
                    <div
                        className={
                            `rounded-md ring-1 ring-black ring-opacity-5 ` +
                            contentClasses
                        }
                    >
                        {children}
                    </div>
                </div>
            </Transition>
        </>
    );
};

const DropdownLink = ({ className = '', children, ...props }) => {
    return (
        <Link
            {...props}
            className={
                'block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ' +
                className
            }
        >
            {children}
        </Link>
    );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;

// --5. UI--
export default Dropdown;
