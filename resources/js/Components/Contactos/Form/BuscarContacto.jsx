import { BotonesFormulario } from "@/Components/BotonesFormulario/BotonesFormulario";
import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";
import { useEffect } from "react";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const BuscarContacto = ({
    selects,
    handleOpenBuscador,
    isAdmin,
    setVista,
    isSmallScreen,
}) => {
    const clasesDOM =
        "mt-1 block w-full rounded-lg bg-[#121827] text-gray-200 text-center";

    const clasesLabel = "text-center mb-2 text-black select-none";

    const { tipos_contacto } = selects;

    useEffect(() => {
        setTimeout(() => {
            document.getElementById("buscarContacto").scrollTo(0, 0);
        }, 100);
    }, []);

    const { data, setData, post, errors, reset } = useForm({
        propio: true,
        frecuencia: "",
        nombre: "",
        comprobado: null,
        privado: null,
        fecha_ini: "",
        fecha_fin: "",
        tipo_id: undefined,
        localidad: "",
        provincia: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("contacto_busqueda"), {
            onSuccess: () => {
                const Toast = Swal.mixin({
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
                Toast.fire({
                    icon: "success",
                    title: "Busqueda finalizada",
                });
                isSmallScreen ? setVista("movil") : handleOpenBuscador(null);
            },
            onError: () => {
                const Toast = Swal.mixin({
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
                Toast.fire({
                    icon: "error",
                    title: "Hubo un error al buscar",
                });
            },
        });
    };

    return (
        <div
            id="buscarContacto"
            className={` ${
                isSmallScreen ? "w-screen overflow-y-auto" : "w-1/2"
            } flex flex-col items-center justify-between  rounded-xl m-auto`}
        >
            <header className="h-15 w-full flex items-center justify-center bg-gradient-to-tl from-blue-900 bg-slate-800 rounded-tr-xl rounded-tl-xl p-5 font-bold text-xl shadow-[inset_2px_0_5px_rgba(255,255,255,.5),inset_-2px_0_5px_rgba(0,0,0,.5)]">
                Buscador de Frecuencias
            </header>

            <form
                method="post"
                onSubmit={submit}
                className="h-full w-full flex flex-col justify-between "
            >
                <main className="flex flex-col grow bg-gradient-to-br from-slate-800  to-gray-800 shadow-[inset_2px_0px_5px_rgba(255,255,255,.5),inset_-2px_0px_5px_rgba(0,0,0,.5)] pb-5">
                    <div className="flex flex-col items-center justify-end">
                        <div className="w-full flex flex-row items-center justify-end">
                            <InputLabel
                                htmlFor="propio"
                                value="Contactos propios"
                            />
                            <Checkbox
                                id="propio"
                                name="propio"
                                onChange={() => setData("propio", !data.propio)}
                                checked={data.propio}
                            />

                            <InputError
                                message={errors.propio}
                                className="mt-2"
                            />
                        </div>
                        <div className="w-full flex flex-row items-center justify-end">
                            <InputLabel
                                htmlFor="comprobado"
                                value="Comprobado"
                            />
                            <Checkbox
                                id="comprobado"
                                name="comprobado"
                                onChange={() =>
                                    setData("comprobado", !data.comprobado)
                                }
                                checked={data.comprobado}
                            />

                            <InputError
                                message={errors.comprobado}
                                className="mt-2"
                            />
                        </div>
                        {isAdmin ? (
                            <div className="w-full flex flex-row items-center justify-end">
                                <InputLabel htmlFor="privado" value="Privado" />
                                <Checkbox
                                    id="privado"
                                    name="privado"
                                    onChange={(e) =>
                                        setData("privado", !data.privado)
                                    }
                                    checked={data.privado ? "on" : ""}
                                />
                                <InputError
                                    message={errors.privado}
                                    className="mt-2"
                                />
                            </div>
                        ) : (
                            ""
                        )}
                    </div>

                    <div className="flex flex-row items-center justify-between px-4 gap-4 mt-4">
                        <div className="w-full flex flex-col items-center">
                            <InputLabel
                                htmlFor="fecha_ini"
                                value="Fecha Inicio"
                                className={clasesLabel}
                            />
                            <input
                                type="date"
                                id="fecha_ini"
                                name="fecha_ini"
                                className={clasesDOM}
                                onChange={(e) =>
                                    setData("fecha_ini", e.target.value)
                                }
                                value={data.fecha_ini}
                            />
                            <InputError
                                message={errors.fecha_ini}
                                className="mt-2"
                            />
                        </div>
                        <div className="w-full flex flex-col items-center">
                            <InputLabel
                                htmlFor="fecha_fin"
                                value="Fecha Fin"
                                className={clasesLabel}
                            />
                            <input
                                type="date"
                                id="fecha_fin"
                                name="fecha_fin"
                                className={clasesDOM}
                                onChange={(e) =>
                                    setData("fecha_fin", e.target.value)
                                }
                                value={data.fecha_fin}
                            />
                            <InputError
                                message={errors.fecha_fin}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div className="flex flex-row items-center justify-between px-4 gap-4 mt-4">
                        <div className="w-full flex flex-col items-center">
                            <InputLabel
                                htmlFor="tipo_id"
                                value="Tipo"
                                className={clasesLabel}
                            />
                            <select
                                id="tipo_id"
                                name="tipo_id"
                                value={data.tipo_id}
                                className="block w-full rounded-lg bg-[#121827] text-white text-center items-center justify-center cursor-pointer "
                                onChange={(e) =>
                                    setData("tipo_id", e.target.value)
                                }
                                placeholder="tipo"
                            >
                                {Object.entries(tipos_contacto).map(
                                    ([id, tipo]) => (
                                        <option
                                            key={id} // Asegúrate de agregar una clave única para cada opción
                                            className="mt-1 block w-full bg-[#121827] cursor-pointer"
                                            value={id ?? -1}
                                        >
                                            {tipo}
                                        </option>
                                    )
                                )}
                            </select>

                            <InputError
                                message={errors.tipo}
                                className="mt-2"
                            />
                        </div>
                    </div>
                    <div className="flex flex-row items-center justify-between px-4 gap-4 mt-4">
                        <div className="w-full">
                            <InputLabel
                                htmlFor="nombre"
                                value="Nombre"
                                className={clasesLabel}
                            />
                            <TextInput
                                id="nombre"
                                name="nombre"
                                value={data.nombre}
                                className="mt-1 block w-full text-center"
                                isFocused={true}
                                onChange={(e) =>
                                    setData("nombre", e.target.value)
                                }
                                placeholder="Nombre"
                                autoComplete="off"
                            />
                            <InputError
                                message={errors.frecuencia}
                                className="mt-2"
                            />
                        </div>
                        <div className="w-full">
                            <InputLabel
                                htmlFor="frecuencia"
                                value="Frecuencia"
                                className={clasesLabel}
                            />
                            <TextInput
                                id="frecuencia"
                                name="frecuencia"
                                value={data.frecuencia}
                                className="mt-1 block w-full text-center"
                                isFocused={true}
                                onChange={(e) =>
                                    setData("frecuencia", e.target.value)
                                }
                                placeholder="Frecuencia"
                                autoComplete="off"
                            />
                            <InputError
                                message={errors.frecuencia}
                                className="mt-2"
                            />
                        </div>
                    </div>
                    <div className="flex flex-row items-center justify-between px-4 gap-4 mt-4">
                        <div className="w-full flex flex-col items-center">
                            <InputLabel
                                htmlFor="localidad"
                                value="Localidad"
                                className={clasesLabel}
                            />
                            <TextInput
                                id="localidad"
                                name="localidad"
                                value={data.localidad}
                                className="mt-1 block w-full text-center"
                                isFocused={true}
                                onChange={(e) =>
                                    setData("localidad", e.target.value)
                                }
                                placeholder="Localidad"
                                autoComplete="off"
                            />

                            <InputError
                                message={errors.localidad}
                                className="mt-2"
                            />
                        </div>
                        <div className="w-full flex flex-col items-center">
                            <InputLabel
                                htmlFor="provincia"
                                value="Provincia"
                                className={clasesLabel}
                            />
                            <TextInput
                                id="provincia"
                                name="provincia"
                                value={data.provincia}
                                className="mt-1 block w-full text-center"
                                isFocused={true}
                                onChange={(e) =>
                                    setData("provincia", e.target.value)
                                }
                                placeholder="Provincia"
                                autoComplete="off"
                            />

                            <InputError
                                message={errors.localidad}
                                className="mt-2"
                            />
                        </div>
                    </div>
                </main>

                <footer className="p-5 flex items-center justify-around h-15 bg-gradient-to-br from-blue-900 bg-slate-800 rounded-br-xl rounded-bl-xl font-bold text-xl shadow-[inset_2px_0_5px_rgba(255,255,255,.5),inset_-2px_0_5px_rgba(0,0,0,.5)] ">
                    <BotonesFormulario
                        actionSubmit={submit}
                        actionReset={() => reset()}
                        actionExit={() => {
                            handleOpenBuscador
                                ? handleOpenBuscador()
                                : setVista("movil");
                        }}
                    />
                </footer>
            </form>
        </div>
    );
};
