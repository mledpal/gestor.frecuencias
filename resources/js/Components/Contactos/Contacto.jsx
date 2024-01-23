import { FrecuenciaComprobada } from "./Icons/FrecuenciaComprobada";
import { ModoTransmision } from "./Icons/ModoTransmision";
import { Repetidor } from "./Icons/Repetidor";
import { Gps } from "./Icons/Gps";
import { Privado } from "./Icons/Privado";

export const Contacto = ({ datos, setDatos }) => {
    const claseContacto = `w-[250px] h-[80px] shadow-gray-400 flex flex-row items-center justify-around rounded-tl-md rounded-br-md rounded-tr-2xl rounded-bl-2xl my-2 cursor-pointer shadow-inner select-none ease-in-out hover:bg-gradient-to-b hover:bg-gray-800 hover:from-gray-600 ${datos.tipo.color}`;

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
                        <div>
                            <Repetidor repetidor={datos.repetidor_id} />
                        </div>
                        <div>
                            {datos.localizacion?.gps ? (
                                <Gps gps={datos.localizacion?.gps} />
                            ) : (
                                ""
                            )}
                        </div>
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
