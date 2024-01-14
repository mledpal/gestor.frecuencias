import { Contacto } from "./Contacto";

export const ListaContactos = ({
    contactos,
    tipos_contacto,
    bandas,
    modos,
    codificaciones,
    dcs,
    ctcss,
}) => {
    return (
        <div className="h-full flex flex-col ">
            {contactos.length > 0 ? (
                contactos.map((c) => (
                    <Contacto
                        key={c.id}
                        datos={c}
                        tipos_contacto={tipos_contacto}
                        bandas={bandas}
                        modos={modos}
                        codificaciones={codificaciones}
                        dcs={dcs}
                        ctcss={ctcss}
                    />
                ))
            ) : (
                <h2>No hay resultados</h2>
            )}{" "}
        </div>
    );
};
