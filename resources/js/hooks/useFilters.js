import { useEffect, useState } from "react";

export const useFilters = (busqueda) => {
    const [isLoading, setLoading] = useState(false);
    const [stateFilters, setFilterState] = useState(false);
    const [contactos, setContactos] = useState(null);
    const [contactosFiltrados, setFiltrados] = useState([]);
    const [visible, setVisible] = useState(false);

    const [filtros, setFiltros] = useState({
        favorito: true,
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

    const listaFiltros = [
        { label: "Favoritos", key: "favorito" },
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

    async function getContactos() {
        setLoading(true);
        if (busqueda === undefined) {
            const response = await fetch("ajax/contacto/get");
            const data = await response.json();
            data && setContactos(data);
        } else {
            setContactos(busqueda);
        }
        setLoading(false);
    }

    useEffect(() => {
        setLoading(true);
        getContactos();
        setLoading(false);
    }, [busqueda]);

    useEffect(() => {
        setLoading(true);
        if (contactos !== null) setFiltrados(filtrarContactos(contactos));
        setLoading(false);
    }, [contactos, filtros]);

    const busquedaReset = () => {
        busqueda = undefined;
        getContactos();
    };

    const handleFilterVisible = () => {
        setVisible(!visible);
    };

    const handleCheck = (filtro) => {
        setFiltros({ ...filtros, [filtro]: !filtros[filtro] });
    };

    const filtrarContactos = (contactos) => {
        return (
            contactos &&
            contactos.filter((dato) => {
                return (
                    (dato.favorito === 1 && filtros.favorito) ||
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
            })
        );
    };

    const handlerCheckUncheck = () => {
        setFilterState(!stateFilters);

        setFiltros((prevFiltros) => {
            const nuevoFiltros = { ...prevFiltros };
            listaFiltros.forEach((f) => {
                nuevoFiltros[f.key] = stateFilters;
            });
            return nuevoFiltros;
        });
    };

    const eraseContact = (id) => {
        const nuevosContactos = contactos.filter(
            (contacto) => contacto.id !== id
        );
        setContactos(nuevosContactos);
    };

    const updateContact = () => {
        getContactos();
    };

    return {
        isLoading,
        visible,
        filtros,
        handleCheck,
        contactosFiltrados,
        listaFiltros,
        handleFilterVisible,
        handlerCheckUncheck,
        eraseContact,
        updateContact,
        busquedaReset,
    };
};
