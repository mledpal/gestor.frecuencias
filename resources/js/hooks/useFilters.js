import { useEffect, useState } from "react";

export const useFilters = (contactos) => {
    const listaFiltros = [
        { label: "Comprobados", key: "comprobado" },
        { label: "Desconocidos", key: "nocomprobado" },
        { label: "Públicos", key: "publico" },
        { label: "Privados", key: "privado" },
        { label: "Aviación", key: "aviacion" },
        { label: "Emisoras", key: "emisora" },
        { label: "Empresas", key: "empresa" },
        { label: "Eventos", key: "evento" },
        { label: "Particulares", key: "particular" },
        { label: "Servicios", key: "servicio" },
    ];

    const [contactosFiltrados, setFiltrados] = useState([]);
    const [visible, setVisible] = useState(false);
    const [filtros, setFiltros] = useState({
        comprobado: true,
        nocomprobado: true,
        publico: true,
        privado: true,
        empresa: true,
        servicio: true,
        particular: true,
        evento: true,
        aviacion: true,
        emisora: true,
    });

    const handleFilterVisible = () => {
        setVisible(!visible);
    };

    const handleCheck = (filtro) => {
        setFiltros({ ...filtros, [filtro]: !filtros[filtro] });
    };

    const filtrarContactos = (contacts) => {
        return contacts.filter((dato) => {
            return (
                (dato.comprobado === 1 && filtros.comprobado) ||
                (dato.comprobado === 0 && filtros.nocomprobado) ||
                (dato.privado === 0 && filtros.publico) ||
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

    useEffect(() => {
        setFiltrados(filtrarContactos(contactos));
    }, [contactos, filtros]);

    useEffect(() => {
        filtrarContactos(contactos);
    }, [filtros]);

    const handlerCheckUncheck = () => {
        setFiltros((prevFiltros) => {
            const nuevoFiltros = { ...prevFiltros };
            listaFiltros.forEach((f) => {
                nuevoFiltros[f.key] = !prevFiltros[f.key];
            });
            return nuevoFiltros;
        });
    };

    return {
        visible,
        filtros,
        handleCheck,
        contactosFiltrados,
        listaFiltros,
        handleFilterVisible,
        handlerCheckUncheck,
    };
};
