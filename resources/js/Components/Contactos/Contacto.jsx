import { FrecuenciaComprobada } from "./Icons/FrecuenciaComprobada";
import { ModoTransmision } from "./Icons/ModoTransmision";
import { Repetidor } from "./Icons/Repetidor";
import { Gps } from "./Icons/Gps";
import { Privado } from "./Icons/Privado";
import { Favorito } from "./Icons/Favorito";
import { useMediaQuery } from "@react-hook/media-query";

export const Contacto = ({ datos, setDatos }) => {
    const isSmallScreen = useMediaQuery("(max-width: 900px)");

    const clasesMovil = `w-screen h-[80px]  flex flex-row items-center justify-around cursor-pointer  select-none ease-in-out hover:bg-gradient-to-bl duration-100 ease-in-out hover:bg-gray-900 hover:from-gray-600 hover:scale-95 hover:shadow-[inset_-2px_2px_10px_rgba(255,255,255,.5),inset_2px_-2px_5px_rgba(0,0,0,.8)]
    bg-gradient-to-b from-${datos.tipo.color} to-gray-800`;

    const clasesPC = `w-full h-[80px]  flex flex-row items-center justify-around cursor-pointer shadow-[inset_-2px_2px_10px_rgba(255,255,255,.7),inset_2px_-2px_5px_rgba(0,0,0,.9)] select-none ease-in-out hover:bg-gradient-to-bl ease-in-out hover:text-black hover:bg-emerald-200 hover:from-green-600 duration-150 hover:scale-95 hover:shadow-[inset_-2px_2px_10px_rgba(255,255,255,.5),inset_2px_-2px_5px_rgba(0,0,0,.8)]
    bg-gradient-to-b from-${datos.tipo.color} to-gray-800`;

    const claseContacto = isSmallScreen ? clasesMovil : clasesPC;

    try {
        return (
            <div
                className="w-full"
                onClick={() => {
                    setDatos(datos);
                }}
            >
                <div className={claseContacto}>
                    <div name="datos" className="w-full text-center">
                        <p className="text-lg font-bold max-[1280px]:text-sm">
                            {datos.frecuencia.frecuencia}
                        </p>
                        <p
                            className={`font-thin text-xs ${
                                !isSmallScreen
                                    ? "max-[1280px]:text-[.7rem]"
                                    : ""
                            }`}
                        >
                            {datos.nombre}
                        </p>

                        <p
                            className={`font-thin text-xs ${
                                !isSmallScreen
                                    ? "max-[1280px]:text-[.5rem]"
                                    : ""
                            }`}
                        >
                            {datos.localizacion
                                ? datos.localizacion.localidad
                                : ""}
                        </p>
                    </div>
                    <div
                        name="iconos"
                        className="w-[40%] h-full flex flex-col items-center justify-between py-2"
                    >
                        <Repetidor repetidor={datos.repetidor_id} />

                        {datos.localizacion?.gps ? (
                            <Gps gps={datos.localizacion?.gps} />
                        ) : (
                            ""
                        )}
                        <Privado privado={datos.privado} />
                    </div>
                    <div
                        name="tecnico"
                        className="w-[100px] h-full p-2 flex flex-col justify-between items-center"
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
};
