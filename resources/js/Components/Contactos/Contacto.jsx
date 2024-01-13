import { FrecuenciaComprobada } from "./Icons/FrecuenciaComprobada";
import { ModoTransmision } from "./Icons/ModoTransmision";
import { Repetidor } from "./Icons/Repetidor";
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

export const Contacto = ({ datos }) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen((cur) => !cur);

    try {
        return (
            <>
                <div
                    className="w-full h-[80px] shadow-gray-400 flex flex-row items-center justify-between rounded-tl-md rounded-br-md rounded-tr-2xl rounded-bl-2xl my-2  cursor-pointer bg-indigo-700 bg-gradient-to-r from-indigo-500 shadow-inner hover:bg-gradient-to-tr hover:from-indigo-300"
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
                        <ModoTransmision modo={datos.frecuencia.modo.nombre} />
                    </div>
                </div>

                <Dialog
                    size="xl"
                    open={open}
                    handler={handleOpen}
                    className="bg-transparent shadow-none"
                >
                    <Card className="mx-auto h-3/4 w-3/4">
                        <CardBody className="flex flex-col gap-4">
                            <Typography
                                variant="h4"
                                color="blue-gray"
                                className="p-5 text-center text-white bg-gradient-to-b from-indigo-200 bg-indigo-700 rounded-xl shadow-indigo-950 shadow-inner"
                            >
                                Datos del Contacto {datos.frecuencia.frecuencia}
                            </Typography>
                            <hr />
                            <Typography className="-mb-2" variant="h6">
                                Frecuencia
                            </Typography>
                            <Input
                                size="lg"
                                value={datos.frecuencia.frecuencia}
                            />

                            <Typography className="-mb-2" variant="h6">
                                Localización
                            </Typography>
                            <Input
                                size="lg"
                                value={
                                    datos.localizacion
                                        ? datos.localizacion.localidad
                                        : ""
                                }
                            />
                            <div className="-ml-2.5 -mt-3">
                                <Checkbox label="Remember Me" />
                            </div>
                        </CardBody>
                        <CardFooter className="pt-0">
                            <Button
                                variant="gradient"
                                onClick={handleOpen}
                                fullWidth
                            >
                                Sign In
                            </Button>

                            <Typography
                                variant="small"
                                className="mt-4 flex justify-center"
                            >
                                Don&apos;t have an account?
                                <Typography
                                    as="a"
                                    href="#signup"
                                    variant="small"
                                    color="blue-gray"
                                    className="ml-1 font-bold"
                                    onClick={handleOpen}
                                >
                                    Salir
                                </Typography>
                            </Typography>
                        </CardFooter>
                    </Card>
                </Dialog>
            </>
        );
    } catch (e) {
        console.error(e);
    }
};
