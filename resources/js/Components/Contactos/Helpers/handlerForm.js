import { useEffect, useState } from "react";

export const handlerForm = ({ datos, setData }) => {
    useEffect(() => {
        setVisibilidad((prevVisibilidad) => ({
            ...prevVisibilidad,
            repVisib: datos.frecuencia.repetidor_id ? true : false,
            codVisib: datos.frecuencia.codificacion_id ? true : false,
            locVisib: datos.localizacion_id ? true : false,
        }));
    }, [datos]);

    const [visibilidad, setVisibilidad] = useState({
        repVisib: false,
        codVisib: false,
        locVisib: false,
    });

    const handleToggleVisibilidad = (seccion) => {
        setVisibilidad((prevVisibilidad) => ({
            ...prevVisibilidad,
            [seccion]: !prevVisibilidad[seccion],
        }));
    };

    const handleCheck = (e) => {
        let value = e.target.value;
        const comprobado = document.getElementById("comprobado");

        switch (value) {
            case "1":
                setData("comprobado", "");
                comprobado.checked = "";
                break;
            default:
                setData("comprobado", 1);
                comprobado.checked = 1;
        }
    };

    const handlePrivado = (e) => {
        let value = e.target.value;
        const privado = document.getElementById("privado");

        switch (value) {
            case "1":
                setData("privado", "");
                privado.checked = "";
                break;
            default:
                setData("privado", 1);
                privado.checked = 1;
        }
    };

    return {
        handleCheck,
        handleToggleVisibilidad,
        handlePrivado,
        visibilidad,
        setVisibilidad,
    };
};
