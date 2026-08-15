export const Repetidor = ({ repetidor }) => {
    const encendido = repetidor > 0;

    return (
        <span className="glifo" data-encendido={encendido}>
            DUP
        </span>
    );
};
