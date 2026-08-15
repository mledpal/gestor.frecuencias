import { useTeclaFisica } from "@/hooks/useTeclaFisica";

export default function DangerButton({ className = '', disabled, children, ...props }) {
    const tecla = useTeclaFisica({ silencio: disabled });

    return (
        <button
            {...props}
            {...tecla}
            className={
                `tecla inline-flex items-center px-4 py-2 bg-gradient-to-b from-red-700 to-red-900 border border-escborde rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:from-red-600 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-chasis transition ease-in-out duration-150 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
