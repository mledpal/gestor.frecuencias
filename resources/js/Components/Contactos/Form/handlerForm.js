import { useEffect, useState } from "react";

export const handlerForm = ({datos}) => {

    useEffect(() => {
        setVisibilidad((prevVisibilidad) => ({
            ...prevVisibilidad,
            repVisib: datos.frecuencia.repetidor_id ? true : false,
            codVisib: datos.frecuencia.codificacion_id ? true : false,
            locVisib: datos.localizacion_id ? true : false,
        }));
    }, []);

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

    const handleTipo = (e) => {
        let value = e.target.value;
        setData("tipo_id", value);
    };

    const handleBanda = (e) => {
        let value = e.target.value;
        setData("banda_id", value);
    };

    const handleModo = (e) => {
        let value = e.target.value;
        setData("modo_id", value);
    };

    const handleCodificacion = (e) => {
        let value = e.target.value;
        setData("codificacion_id", value);
    };

    const handleCtcss = (e) => {
        let value = e.target.value;
        setData("ctcss_id", value);
    };

    const handleDcs = (e) => {
        let value = e.target.value;
        setData("dcs_id", value);
    };

    const handleDireccion = (e) => {
        let value = e.target.value;
        setData("direccion", value);
    };

    return {
        handleBanda,
        handleCheck,
        handleCtcss,
        handleDcs,
        handleDireccion,
        handleModo,
        handleTipo,
        handleToggleVisibilidad,
        visibilidad,
        setVisibilidad,
    };
};
