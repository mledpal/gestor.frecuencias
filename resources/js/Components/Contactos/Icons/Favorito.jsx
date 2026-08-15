export const Favorito = ({ favorito }) => {
    return (
        <span className="glifo" data-encendido={!!favorito}>
            FAV
        </span>
    );
};
