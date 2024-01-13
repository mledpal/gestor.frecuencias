import { FrecuenciaComprobada } from "./Icons/FrecuenciaComprobada";
import { ModoTransmision } from "./Icons/ModoTransmision";
import { Repetidor } from "./Icons/Repetidor";

export const Contacto = ({ datos }) => {
    console.log(datos);

    return (
        <>
            <div className="w-[100%] h-[80px] shadow-gray-400 flex flex-row items-center justify-between rounded-tl-md rounded-br-md rounded-tr-2xl rounded-bl-2xl my-2  cursor-pointer bg-indigo-700 bg-gradient-to-r from-indigo-500 shadow-inner hover:bg-gradient-to-tr hover:from-indigo-300">
                <div name="datos" className="p-2 w-[50%] text-center">
                    <p className="text-lg font-bold">
                        {parseFloat(datos.frecuencia.frecuencia).toFixed(3)}
                    </p>
                    <p className="font-thin text-xs">{datos.nombre}</p>

                    <p className="font-thin text-xs">
                        {datos.localizacion.localidad}
                    </p>
                </div>
                <div name="otros" className="w-[40%]"></div>
                <div
                    name="tecnico"
                    className="w-[10%] h-[100%] p-2 flex flex-col justify-between items-center"
                >
                    <FrecuenciaComprobada comprobada={datos.comprobado} />
                    <Repetidor repetidor={datos.frecuencia.repetidor_id} />
                    <ModoTransmision modo={datos.frecuencia.modo.nombre} />
                </div>
            </div>
        </>
    );
};
