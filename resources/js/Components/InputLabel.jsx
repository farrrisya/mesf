export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block text-sm font-medium text-gray-700 ` + // css
                className
            }
        >
            {value ? value : children} {/* input */}
        </label>
    );
}
