import { FrecuenciaComprobada } from "./Icons/FrecuenciaComprobada";
import { ModoTransmision } from "./Icons/ModoTransmision";
import { Repetidor } from "./Icons/Repetidor";
import { EditarContacto } from "./Form/EditarContacto";
import React from "react";

import {
    Button,
    Dialog,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Input,
    Checkbox,
} from "@material-tailwind/react";

export const Contacto = ({
    datos,
    tipos_contacto,
    bandas,
    modos,
    codificaciones,
    ctcss,
    dcs,
}) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = (e) => {
        setOpen((cur) => !cur);
    };

    try {
        return (
            <>
                <div
                    className="w-full h-[80px] shadow-gray-400 flex flex-row items-center justify-between rounded-tl-md rounded-br-md rounded-tr-2xl rounded-bl-2xl my-2  cursor-pointer bg-indigo-700 bg-gradient-to-r from-indigo-500 shadow-inner hover:bg-gradient-to-tr hover:from-indigo-300 hover:ease-in-out"
                    onClick={handleOpen}
                >
                    <div name="datos" className="p-2 w-1/2 text-center">
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
                    <div name="otros" className="w-[40%]"></div>
                    <div
                        name="tecnico"
                        className="w-[10%] h-full p-2 flex flex-col justify-between items-center"
                    >
                        <FrecuenciaComprobada comprobada={datos.comprobado} />
                        <Repetidor repetidor={datos.frecuencia.repetidor_id} />
                        <ModoTransmision
                            modo={
                                datos.frecuencia.modo
                                    ? datos.frecuencia.modo.nombre
                                    : ""
                            }
                        />
                    </div>
                </div>

                <Dialog
                    size="xl"
                    open={open}
                    handler={handleOpen}
                    className="bg-transparent shadow-none overflow-y-auto"
                >
                    <EditarContacto
                        datos={datos}
                        handleOpen={handleOpen}
                        tipos_contacto={tipos_contacto}
                        bandas={bandas}
                        modos={modos}
                        codificaciones={codificaciones}
                        dcs={dcs}
                        ctcss={ctcss}
                    />
                </Dialog>
            </>
        );
    } catch (e) {
        console.error(e);
    }
};
