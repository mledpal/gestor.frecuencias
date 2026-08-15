import { forwardRef, useEffect, useRef } from "react";

export default forwardRef(function TextInput(
    { type = "text", className = "", isFocused = false, ...props },
    ref
) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <input
            {...props}
            type={type}
            className={
                "border border-escborde text-lcd bg-lcdbg shadow-hundido focus:border-rotulo focus:ring-0 focus:shadow-[var(--esc-hundido),var(--esc-lcd-glow)] rounded-md " +
                className
            }
            ref={input}
            autoComplete="off"
        />
    );
});
