export const FrecuenciaComprobada = ({ comprobada }) => {
    return (
        <span name="comprobada" className="glifo" data-encendido={!!comprobada}>
            OK
        </span>
    );
};
