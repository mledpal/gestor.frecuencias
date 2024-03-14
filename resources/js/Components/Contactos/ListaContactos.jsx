import { Contacto } from "./Contacto";
import { Mobile } from "./Form/Headers/Mobile";
import { AppContext } from "../AppProvider";
import { useContext } from "react";

export const ListaContactos = ({ contactos, setDatos, setVista }) => {
    const { isSmallScreen } = useContext(AppContext);
    return (
        <>
            <div className="h-full w-full flex flex-col items-center">
                { contactos && contactos.length > 0 ? (
                    contactos.map((c) => (
                        <Contacto key={c.id} datos={c} setDatos={setDatos} />
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
};
