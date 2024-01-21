import { useState } from "react";


export const useContactoCreate = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(!open); // Cambia el valor de open a su opuesto
    };

    const datosNuevos = {
        frecuencia: "",
        nombre: "",
        observaciones: "",
        comprobado: 0,
        privado: 0,
        frecuencia_id: -1,
        hora: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        }),
        fecha: new Date().toISOString().split("T")[0],
        tipo_id: 0,
        banda_id: -1,
        modo_id: -1,
        calidad: 0,
        offset: null,
        direccion: "=",
        codificacion_id: -1,
        dcs_id: -1,
        ctcss_id: -1,
        localizacion_id: -1,
        localidad: "",
        provincia: "",
        pais: "",
        gps: "",
    };

    return {
        datosNuevos,
        handleOpen,
        open,
    };
};
