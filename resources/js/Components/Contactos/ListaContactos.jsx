import { Contacto } from "./Contacto";
import { Mobile } from "./Form/Headers/Mobile";
import { AppContext } from "../AppProvider";
import { memo, useContext } from "react";

export const ListaContactos = memo(function ListaContactos({
    contactos,
    setDatos,
    setVista,
}) {
    const { isSmallScreen, contactoActivo } = useContext(AppContext);
    return (
        <>
            <div className="h-full w-full flex flex-col items-center">
                { contactos && contactos.length > 0 ? (
                    contactos.map((c) => (
                        <Contacto
                            key={c.id}
                            datos={c}
                            setDatos={setDatos}
                            activo={contactoActivo?.id === c.id}
                        />
                    ))
                ) : (
                    <div className="h-full w-full flex flex-col">
                        {isSmallScreen ? <Mobile setVista={setVista} /> : ""}
                        <main className="w-full h-5/6 bg-transparent grid place-items-center">
                            <h2>No hay contactos</h2>
                        </main>
                    </div>
                )}
            </div>
        </>
    );
});
