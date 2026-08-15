export const Gps = ({ gps }) => {
    const encendido = gps?.length > 0;

    return (
        <span className="glifo" data-encendido={encendido}>
            GPS
        </span>
    );
};
