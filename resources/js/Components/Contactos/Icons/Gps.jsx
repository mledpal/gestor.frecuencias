export const Gps = ({ gps }) => {

    if (gps.length > 0) { return <i className="fa-solid fa-location-dot"></i> } else {return <div></div>};
};
