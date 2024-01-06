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
                `block font-medium text-xl text-gray-700 dark:text-gray-500 ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
