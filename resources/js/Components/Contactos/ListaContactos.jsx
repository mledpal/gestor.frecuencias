import { Contacto } from "./Contacto";

export const ListaContactos = ({ contactos, setDatos }) => {
    return (
        <>
            <div className="h-full w-full flex flex-col items-center p-1 ">
                {contactos.length > 0 ? (
                    contactos.map((c) => (
                        <Contacto key={c.id} datos={c} setDatos={setDatos} />
                    ))
                ) : (
                    <h2>No hay resultados</h2>
                )}{" "}
            </div>
        </>
    );
};
