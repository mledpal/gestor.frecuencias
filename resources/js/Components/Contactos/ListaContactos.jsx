import { Contacto } from "./Contacto";

export const ListaContactos = ({ contactos, setDatos }) => {

    return (
        <>
            <div className="h-full flex flex-col p-4">
                {contactos.length > 0 ? (
                    contactos.map((c) => (
                        <Contacto
                            key={c.id}
                            datos={c}
                            setDatos={setDatos}
                        />
                    ))
                ) : (
                    <h2>No hay resultados</h2>
                )}{" "}
            </div>
        </>
    );
};
