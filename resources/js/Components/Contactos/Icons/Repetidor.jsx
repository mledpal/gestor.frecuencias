export const Repetidor = ({ repetidor }) => {
    if (repetidor > 0) {
        return <i className="fa-solid fa-tower-cell"></i>;
    } else return <div></div>;
};
