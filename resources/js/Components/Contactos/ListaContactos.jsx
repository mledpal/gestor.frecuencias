import { Contacto } from "./Contacto";

export const ListaContactos = ({ contactos }) => {
    return (
        <div className="overflow-y-auto">
            {contactos.length > 0 ? (
                contactos.map((c) => <Contacto key={c.id} datos={c} />)
            ) : (
                <h2>No hay resultados</h2>
            )}{" "}
        </div>
    );
};
