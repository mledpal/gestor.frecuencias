import { useTeclaFisica } from "@/hooks/useTeclaFisica";

export default function SecondaryButton({ type = 'button', className = '', disabled, children, ...props }) {
    const tecla = useTeclaFisica({ silencio: disabled });

    return (
        <button
            {...props}
            {...tecla}
            type={type}
            className={
                `tecla inline-flex items-center px-4 py-2 border border-escborde rounded-md font-semibold text-xs text-rotulo uppercase tracking-widest hover:text-lcd focus:outline-none focus:ring-2 focus:ring-rotulo focus:ring-offset-2 focus:ring-offset-chasis disabled:opacity-25 transition ease-in-out duration-150 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
