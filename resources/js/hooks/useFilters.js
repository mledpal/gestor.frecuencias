import { AppContext } from "@/Components/AppProvider";
import { getContactos } from "@/Helpers/getContactos";
import { useContext, useEffect, useState } from "react";

const contactosCargados = await getContactos();

export const useFilters = () => {
    const { contactos, setContactos, busqueda, setBusqueda } =
        useContext(AppContext);

    // const [contactos, setContactos] = useState(null);
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

    useEffect(() => {
        const storedFiltros = localStorage.getItem("filtros");
        if (storedFiltros) {
            setFiltros(JSON.parse(storedFiltros));
        }
    }, []);

    const handleCheck = (e, filtroKey) => {
        const isChecked = e.target.checked;

        // Actualizar el estado de los filtros
        setFiltros((prevFiltros) => ({
            ...prevFiltros,
            [filtroKey]: isChecked,
        }));

        // Guardar los filtros en el LocalStorage
        // Utilizamos el estado actualizado (prevFiltros)
        // en lugar de la variable filtros.
        localStorage.setItem(
            "filtros",
            JSON.stringify({
                ...filtros,
                [filtroKey]: isChecked,
            })
        );
    };

    useEffect(() => {
        setContactos(contactosCargados);
    }, []);

    useEffect(() => {
        if (busqueda) {
            setContactos(busqueda);
        }
    }, [busqueda]);

    useEffect(() => {
        if (busqueda) {
            contactos && setFiltrados(filtrarContactos(busqueda));
        } else if (contactos) {
            contactos && setFiltrados(filtrarContactos(contactos));
        }
    }, [contactos, filtros]);

    const busquedaReset = () => {
        setBusqueda(null);
        setContactos(contactosCargados);
    };

    const handleFilterVisible = () => {
        setVisible((prevVisible) => !prevVisible);
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

            // Determinar el nuevo estado opuesto
            const newFilterState = !Object.values(prevFiltros)[0];

            // Actualizar los filtros
            const updatedFilters = {};
            for (const key in prevFiltros) {
                updatedFilters[key] = newFilterState;
            }

            // Actualizar el estado local
            localStorage.setItem("filtros", JSON.stringify(updatedFilters));

            // Devolver los filtros actualizados
            return updatedFilters;
        });
    };

    const eraseContact = (id) => {
        setContactos((prevContactos) =>
            prevContactos.filter((contacto) => contacto.id !== id)
        );
        updateContact();
    };

    const updateContact = async() => {
        const nuevosContactos = await getContactos();
        nuevosContactos && setContactos(nuevosContactos);
    };

    const verSeleccion = (seleccion) => {
        setFiltros((prevFiltros) => {
            const nuevosFiltros = {}; // Objeto para almacenar los nuevos filtros

            // Iterar sobre cada filtro en prevFiltros
            for (const filtro in prevFiltros) {
                if (filtro === seleccion || seleccion === "todos") {
                    nuevosFiltros[filtro] = true; // Establecer favorito en true
                } else {
                    nuevosFiltros[filtro] = false; // Establecer todos los demás en false
                }
            }

            return nuevosFiltros; // Devolver el objeto con los nuevos filtros
        });
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
        verSeleccion,
    };
};
