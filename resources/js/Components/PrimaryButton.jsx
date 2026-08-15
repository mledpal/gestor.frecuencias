import { useTeclaFisica } from "@/hooks/useTeclaFisica";

export default function PrimaryButton({
    className = "",
    disabled,
    children,
    ...props
}) {
    const tecla = useTeclaFisica({ silencio: disabled });

    return (
        <button
            {...props}
            {...tecla}
            className={
                `tecla inline-flex items-center px-4 py-2 text-lcd border border-escborde rounded-md font-semibold text-xs uppercase tracking-widest hover:text-rotulo focus:outline-none focus:ring-2 focus:ring-rotulo focus:ring-offset-2 focus:ring-offset-chasis transition ease-in-out duration-150 ${
                    disabled && "opacity-25"
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
