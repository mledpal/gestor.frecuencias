export default function InputLabel({
    value,
    className = "",
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block font-medium text-xl text-gray-700 dark:text-gray-900 ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
