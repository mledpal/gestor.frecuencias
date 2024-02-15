import { TipoContacto } from "./TipoContacto";
import { RotatingLines } from "react-loader-spinner";
import TextInput from "@/Components/TextInput";

import { BotonesFormulario } from "@/Components/BotonesFormulario/BotonesFormulario";

import InputError from "@/Components/InputError";
import { useAdminTiposContacto } from "@/hooks/useAdminTiposContacto";

export const TiposContacto = ({ isSmallScreen }) => {
    const { editTipo, delTipo, submit, tipos, setData, data, errors, reset } =
        useAdminTiposContacto();

    return (
        <div className="min-h-screen w-full select-none ">
            <header
                className={`h-[75px] sticky top-0 z-20 w-full flex  items-center justify-center bg-gradient-to-br from-indigo-900 to-indigo-700`}
            >
                <h2>Administración de Tipos de Contacto</h2>
            </header>

            <form
                className={`sticky mt-0 ${
                    isSmallScreen ? "flex-col h-full " : "flex-row h-[80px]"
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
