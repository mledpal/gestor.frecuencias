import { FrecuenciaComprobada } from "./Icons/FrecuenciaComprobada";
import { ModoTransmision } from "./Icons/ModoTransmision";
import { Repetidor } from "./Icons/Repetidor";
import { Gps } from "./Icons/Gps";
import { Privado } from "./Icons/Privado";
import { Favorito } from "./Icons/Favorito";

import { AppContext } from "../AppProvider";
import { memo, useContext } from "react";

export const Contacto = memo(function Contacto({ datos, setDatos, activo }) {
    const { isSmallScreen } = useContext(AppContext);

    // La franja de color por tipo es la única clase dinámica que queda: el
    // resto de la fila se unifica en los tokens de panel/LCD para que se lea
    // como un banco de memorias, y el tipo se sigue reconociendo de un
    // vistazo por el color del borde. El safelist de tailwind.config.js
    // cubre este patrón (from-color-tono).
    const claseFranja = `w-1 h-full shrink-0 bg-gradient-to-b from-${datos.tipo.color} to-transparent`;

    const claseFila = `w-full h-[80px] flex flex-row items-center gap-2 cursor-pointer select-none transition-shadow duration-150 ${
        activo
            ? "bg-lcdbg text-lcd shadow-hundido"
            : "bg-panel text-colortxt shadow-tecla hover:drop-shadow-[0_0_4px_var(--esc-rotulo)]"
    }`;

    try {
        return (
            <div
                className="w-full flex flex-row"
                onClick={() => {
                    setDatos(datos);
                }}
            >
                <span className={claseFranja} aria-hidden="true" />
                <div className={claseFila}>
                    <span
                        className={`w-3 text-center shrink-0 ${
                            activo ? "opacity-100" : "opacity-0"
                        }`}
                        aria-hidden="true"
                    >
                        ▶
                    </span>

                    <div
                        name="datos"
                        className="w-8/12 min-w-0 text-center flex flex-row items-center justify-between h-full"
                    >
                        <p
                            className={`w-3/5 font-lcd ${
                                isSmallScreen
                                    ? "text-xl font-bold"
                                    : "max-[1280px]:text-xs text-lg"
                            }`}
                        >
                            {datos.frecuencia.frecuencia}
                        </p>
                        <div className="w-2/5 min-w-0 flex flex-col text-xs">
                            <p className="font-thin truncate">
                                {datos.nombre}
                            </p>

                            <p
                                className={`font-thin opacity-70 truncate ${
                                    !isSmallScreen
                                        ? "max-[1280px]:text-[.5rem]"
                                        : "text-xs"
                                }`}
                            >
                                {datos.localizacion
                                    ? datos.localizacion.localidad
                                    : ""}
                            </p>
                        </div>
                    </div>
                    <div
                        name="iconos"
                        className="w-2/12 h-full flex flex-col items-center justify-around py-2"
                    >
                        <Repetidor repetidor={datos.repetidor_id} />
                        <Gps gps={datos.localizacion?.gps ?? ""} />
                        <Privado privado={datos.privado} />
                    </div>
                    <div
                        name="tecnico"
                        className="w-2/12 h-full mr-1 flex flex-col justify-around items-center"
                    >
                        <FrecuenciaComprobada comprobada={datos.comprobado} />
                        <Favorito favorito={datos.favorito} />
                        <ModoTransmision
                            modo={datos.modo ? datos.modo.nombre : ""}
                        />
                    </div>
                </div>
            </div>
        );
    } catch (e) {
        console.error(e);
    }
});
