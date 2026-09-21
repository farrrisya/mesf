export default function InputError({ message, className = '', ...props }) {
    return message ? ( // check
        <p
            {...props}
            className={'text-sm text-red-600 ' + className} // css
        >
            {message}
        </p>
    ) : null;
}
