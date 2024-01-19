import { useEffect, useState } from "react";

export const useFilters = (contactos) => {
    const [contactosFiltrados, setFiltrados] = useState([]);

    const [filtros, setFiltros] = useState({
        comprobado: true,
        privado: true,
        empresa: true,
        servicio: true,
        particular: true,
        evento: true,
        aviacion: true,
        emisora: true,
    });

    const handleCheck = (filtro) => {
        setFiltros({ ...filtros, [filtro]: !filtros[filtro] });
    };

    useEffect(() => {
        setFiltrados(filtrarContactos(contactos));
    }, [contactos, filtros]);

    useEffect(() => {
        filtrarContactos(contactos);
    }, [filtros]);

    const filtrarContactos = (contacts) => {
        return contacts.filter((dato) => {
            return (
                (dato.comprobado === 1 && filtros.comprobado) ||
                (dato.privado === 1 && filtros.privado) ||
                (dato.tipo_id === 4 && filtros.empresa) ||
                (dato.tipo_id === 7 && filtros.servicio) ||
                (dato.tipo_id === 6 && filtros.particular) ||
                (dato.tipo_id === 5 && filtros.evento) ||
                (dato.tipo_id === 2 && filtros.aviacion) ||
                (dato.tipo_id === 3 && filtros.emisora)
            );
        });
    };

    return {
        filtros,
        handleCheck,
        contactosFiltrados,
    };
};
