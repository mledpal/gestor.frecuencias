import { FrecuenciaComprobada } from "./Icons/FrecuenciaComprobada";
import { ModoTransmision } from "./Icons/ModoTransmision";
import { Repetidor } from "./Icons/Repetidor";
import { Gps } from "./Icons/Gps";
import { Privado } from "./Icons/Privado";
import { Favorito } from "./Icons/Favorito";

export const Contacto = ({ datos, setDatos }) => {
    const claseContacto = `w-[250px] h-[80px]  flex flex-row items-center justify-around rounded-tl-md rounded-br-md rounded-tr-2xl rounded-bl-2xl my-2 cursor-pointer shadow-[inset_-2px_2px_10px_rgba(255,255,255,.7),inset_2px_-2px_5px_rgba(0,0,0,.9)] select-none ease-in-out hover:bg-gradient-to-bl duration-100 ease-in-out hover:bg-gray-900 hover:from-gray-600 hover:scale-95 hover:shadow-[inset_-2px_2px_10px_rgba(255,255,255,.5),inset_2px_-2px_5px_rgba(0,0,0,.8)] max-[1280px]:scale-75 max-[1280px]:my-0

    bg-gradient-to-b from-${datos.tipo.color} to-gray-800`;

    try {
        return (
            <div
                onClick={() => {
                    setDatos(datos);
                }}
            >
                <div className={claseContacto}>
                    <div name="datos" className="p-2 w-full text-center">
                        <p className="text-lg font-bold">
                            {datos.frecuencia.frecuencia}
                        </p>
                        <p className="font-thin text-xs">{datos.nombre}</p>

                        <p className="font-thin text-xs">
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
                        <Favorito favorito={datos.favorito} />
                    </div>
                    <div
                        name="tecnico"
                        className="w-[100px] h-full p-2 flex flex-col justify-between items-center"
                    >
                        <FrecuenciaComprobada comprobada={datos.comprobado} />
                        <Privado privado={datos.privado} />
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
