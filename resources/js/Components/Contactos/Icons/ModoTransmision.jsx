export const ModoTransmision = ({ modo }) => {
    return (
        <span
            className="glifo min-w-[2.5em] justify-center"
            data-encendido={!!modo}
        >
            {modo || "--"}
        </span>
    );
};
