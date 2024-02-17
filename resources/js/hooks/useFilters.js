import { AppContext } from "@/Components/AppProvider";
import { useContext, useEffect, useState } from "react";

export const useFilters = () => {
    const { busqueda, setBusqueda } = useContext(AppContext);

    const [contactos, setContactos] = useState(null);
    const [contactosFiltrados, setFiltrados] = useState([]);
    const [isLoading, setLoading] = useState(false);
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
        try {
            const response = await fetch("ajax/contacto/get");
            const data = await response.json();
            setContactos(data);
        } catch (error) {
            console.error("Error al obtener contactos:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!busqueda) {
            getContactos();
        } else {
            setContactos(busqueda);
        }
    }, [busqueda]);

    useEffect(() => {
        if (contactos) {
            setFiltrados(filtrarContactos(contactos));
        }
    }, [contactos, filtros]);

    const busquedaReset = () => {
        setBusqueda(null);
    };

    const handleFilterVisible = () => {
        setVisible((prevVisible) => !prevVisible);
    };

    const handleCheck = (filtro) => {
        setFiltros((prevFiltros) => ({
            ...prevFiltros,
            [filtro]: !prevFiltros[filtro],
        }));
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
        setFiltros((prevFiltros) => {
            // Verificar si todos los filtros están en el mismo estado
            const allSameState = Object.values(prevFiltros).every(
                (state) => state === Object.values(prevFiltros)[0]
            );

            // Si todos están en el mismo estado, cambiar al estado contrario
            if (allSameState) {
                const newFiltros = {};
                for (const key in prevFiltros) {
                    newFiltros[key] = !prevFiltros[key];
                }
                return newFiltros;
            } else {
                // Si no, cambiar todos los filtros al estado del primer filtro
                const newState = !Object.values(prevFiltros)[0];
                const newFiltros = {};
                for (const key in prevFiltros) {
                    newFiltros[key] = newState;
                }
                return newFiltros;
            }
        });
    };

    const eraseContact = (id) => {
        setContactos((prevContactos) =>
            prevContactos.filter((contacto) => contacto.id !== id)
        );
    };

    const updateContact = (datosContacto) => {
        getContactos();

        // const index = contactos.findIndex((obj) => obj.id === datosContacto.id);
        // if (index !== -1) {
        //     // Si se encuentra el objeto, actualiza sus propiedades con los nuevos datos
        //     contactos[index] = { ...contactos[index], ...datosContacto };
        // } else {
        //     setContactos(...contactos, datosContacto);
        // }
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
