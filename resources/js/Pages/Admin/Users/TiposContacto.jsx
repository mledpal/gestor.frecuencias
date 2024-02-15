import { useEffect, useState } from "react";
import { TipoContacto } from "./TipoContacto";
import { RotatingLines } from "react-loader-spinner";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";
import { BotonesFormulario } from "@/Components/BotonesFormulario/BotonesFormulario";
import Swal from "sweetalert2";
import InputError from "@/Components/InputError";

export const TiposContacto = ({ isSmallScreen }) => {
    const [tipos, setTipos] = useState();

    const { data, setData, reset, post, errors } = useForm({
        id: "",
        nombre: "",
        color: "",
    });

    const getTipos = () => {
        fetch(route("admin_tipos_contacto"))
            .then((res) => res.json())
            .then((res) => setTipos(res))
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        setTipos(getTipos());
    }, []);

    const mensajeOK = (mensaje) => {
        Swal.fire({
            icon: "success",
            title: mensaje,
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            },
        });
    };

    const mensajeError = (error) => {
        Swal.fire({
            icon: "error",
            title: "Hubo un error",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            },
        });
    };

    const submit = () => {
        if (data.id) {
            post(route("editar_tipo_contacto", { id: data.id }), {
                onSuccess: () => {
                    getTipos();
                    mensajeOK("Tipo editado correctamente");
                },
                onError: (error) => {
                    mensajeError(error);
                },
            });
        } else {
            post(route("nuevo_tipo_contacto"), {
                onSuccess: () => {
                    getTipos();
                    mensajeOK("Tipo agregado correctamente");
                },
                onError: (error) => {
                    mensajeError(error);
                },
            });
        }
    };

    const delTipo = (id) => {
        post(route("eliminar_tipo_contacto", { id: id }), {
            onSuccess: () => {
                getTipos();
                mensajeOK("Tipo eliminado correctamente");
            },
            onError: (error) => {
                mensajeError(error);
            },
        });
        console.log("Eliminar ID : ", id);
    };

    const editTipo = (t) => {
        setData({ id: t.id, nombre: t.nombre, color: t.color });
    };

    return (
        <div>
            <div>
                <form
                    className={`${
                        isSmallScreen ? "flex-col h-full " : "flex-row h-[60px]"
                    } w-full bg-gray-700  flex  items-center justify-between px-5`}
                >
                    <input name="id" type="hidden" value={data.id} />

                    <TextInput
                        id="nombre"
                        name="nombre"
                        value={data.nombre}
                        className={` ${
                            isSmallScreen ? "w-full" : "w-2/5"
                        } block p-2 m-2 text-center`}
                        onChange={(e) => setData("nombre", e.target.value)}
                        placeholder="Tipo de contacto"
                        autoComplete="off"
                        required
                    />
                    <InputError message={errors.nombre} className="mt-2" />
                    <TextInput
                        id="color"
                        name="color"
                        value={data.color}
                        className={` ${
                            isSmallScreen ? "w-full" : "w-2/5"
                        } block p-2 m-2 text-center`}
                        onChange={(e) => setData("color", e.target.value)}
                        placeholder="Color"
                        autoComplete="off"
                        required
                    />
                    <InputError message={errors.color} className="mt-2" />
                    <div
                        className={` flex flex-row ${
                            isSmallScreen
                                ? "w-full items-center justify-around"
                                : "gap-1 "
                        } p-2 `}
                    >
                        <BotonesFormulario
                            textSubmit={`${data.id ? "Editar" : "Nuevo"}`}
                            actionSubmit={submit}
                            actionReset={() => reset()}
                        />
                    </div>
                </form>
            </div>
            {tipos ? (
                tipos.map((t) => {
                    if (t.id)
                        return (
                            <div key={t.id}>
                                <TipoContacto
                                    t={t}
                                    delTipo={delTipo}
                                    editTipo={editTipo}
                                />
                            </div>
                        );
                })
            ) : (
                <div className="h-full w-full grid place-items-center p-1">
                    <RotatingLines
                        visible={true}
                        height="96"
                        width="96"
                        color="grey"
                        strokeWidth="5"
                        animationDuration="0.75"
                        ariaLabel="rotating-lines-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                    />
                </div>
            )}
        </div>
    );
};
