import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";

import { handlerForm } from "../Helpers/handlerForm";

import { handleContacts } from "../Helpers/handleContacts";
import { useContext, useEffect } from "react";
import { BotonesFormulario } from "@/Components/BotonesFormulario/BotonesFormulario";

import { AppContext } from "@/Components/AppProvider";

export const NuevoContacto = ({
    datos,
    selects,
    handleOpen,
    updateContact,
    setVista,
}) => {
    const {
        tipos_contacto,
        bandas,
        modos,
        codificaciones,
        dcs,
        ctcss,
        direcciones,
    } = selects;

    const { isSmallScreen } = useContext(AppContext);

    useEffect(() => {
        setTimeout(() => {
            document.getElementById("nuevocontacto").scrollTo(0, 0);
        }, 100);
    }, []);

    const { data, setData, errors, reset, post, crear, crearMovil } =
        handleContacts({
            isSmallScreen,
            datos,
            updateContact,
            handleOpen,
            setVista,
        });

    const {
        handleCheck,
        handlePrivado,
        handleFavorito,
        handleToggleVisibilidad,
        visibilidad,
    } = handlerForm({ datos, setData });

    // Variables para setear los estilos de algunas zonas

    const claseContacto = `${
        isSmallScreen ? "w-full" : "w-1/2 max-[1280px]:w-5/6"
    } flex flex-col items-center justify-between rounded-xl m-auto bg-indigo-900  shadow-[0_0_15px_rgba(255,255,255,.6)] `;
    const classZona = `${
        isSmallScreen ? "w-full" : "w-4/5 max-[1280px]:w-5/6"
    }  flex flex-col items-center m-4 rounded-2xl border-2 border-blue-950 shadow-lg`;
    const clasesDOM =
        "mt-1 block w-full rounded-lg bg-[#121827] text-gray-200 text-center";
    const clasesLegend =
        "w-full bg-blue-950 text-xl font-bold p-2 select-none cursor-pointer flex flex-row items-center justify-center gap-10 p-5 rounded-t-xl ";
    const clasesFieldSet =
        "p-4 w-full flex flex-col items-center justify-start mb-2 ";
    const clasesDivContainer =
        "flex flex-row w-4/5 place-content-center gap-10 m-2 items-center max-[1600px]:flex-col max-[1600px]:gap-2";
    const clasesLabel = "text-center mb-2 text-black select-none";
    const clasesAgregar =
        "rounded-full transition shadow-[inset_0_0_5px_rgba(0,0,0,.5)] hover:bg-lime-500 hover:shadow-[0_0_5px_rgba(255,255,255,.5)] ease-in transition:ease-out duration-100 m-2 fa-solid fa-plus cursor-pointer select-none p-3";

    return (
        <form
            id="nuevocontacto"
            method="POST"
            onSubmit={(e) => {
                e.preventDefault(); // Esto previene el comportamiento por defecto del formulario
                isSmallScreen ? crearMovil() : crear();
            }}
            encType="multipart/form-data"
            className={claseContacto}
        >
            <div
                className={` ${
                    isSmallScreen
                        ? "w-full gap-0"
                        : "w-full max-[1280px]:w-5/6 flex-row gap-10"
                } flex flex-col items-center sticky top-0  bg-slate-900 z-10 mt-0 p-4 `}
            >
                <div
                    className={` ${
                        isSmallScreen ? "w-full p-4" : "w-2/5 "
                    } flex flex-col items-center justify-center`}
                >
                    <h2 className="font-bold text-xl">Nuevo Contacto</h2>
                </div>

                <div
                    name="guardar_datos"
                    className={` ${
                        isSmallScreen ? "w-full p-2" : "w-3/5 "
                    } flex flex-row items-center justify-around`}
                >
                    <BotonesFormulario
                        actionSubmit={isSmallScreen ? crearMovil : crear}
                        actionReset={() => reset()}
                        actionExit={() => {
                            handleOpen ? handleOpen() : setVista("movil");
                        }}
                    />
                </div>
            </div>

            <div className={classZona}>
                <legend className={clasesLegend}>Datos</legend>
                <fieldset name="datos" className={clasesFieldSet}>
                    <div className={clasesDivContainer}>
                        <div className="w-full flex flex-row items-center justify-center max-[1600px]:justify-end">
                            <InputLabel
                                htmlFor="comprobado"
                                value="Comprobado"
                                className={clasesLabel}
                            />
                            <Checkbox
                                id="comprobado"
                                name="comprobado"
                                onChange={(e) => handleCheck(e)}
                                value={data.comprobado}
                                checked={data.comprobado ? "on" : ""}
                            />
                            <InputError
                                message={errors.comprobado}
                                className="mt-2"
                            />
                        </div>
                        <div className="w-full flex flex-row items-center justify-center max-[1600px]:justify-end">
                            <InputLabel
                                htmlFor="favorito"
                                value="Favorito"
                                className={clasesLabel}
                            />
                            <Checkbox
                                id="favorito"
                                name="favorito"
                                onChange={(e) => handleFavorito(e)}
                                value={data.favorito}
                                checked={data.favorito ? "on" : ""}
                            />
                            <InputError
                                message={errors.favorito}
                                className="mt-2"
                            />
                        </div>
                        <div className="w-full flex flex-row items-center justify-center max-[1600px]:justify-end">
                            <InputLabel
                                htmlFor="privado"
                                value="Privado"
                                className={clasesLabel}
                            />
                            <Checkbox
                                id="privado"
                                name="privado"
                                onChange={(e) => handlePrivado(e)}
                                value={data.privado}
                                checked={data.privado ? "on" : ""}
                            />
                            <InputError
                                message={errors.privado}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div className={clasesDivContainer}>
                        <div className="w-1/3 flex flex-col items-center max-[1600px]:w-full">
                            <InputLabel
                                htmlFor="tipo_id"
                                value="Tipo"
                                className={clasesLabel}
                            />
                            <select
                                id="tipo_id"
                                name="tipo_id"
                                value={data.tipo_id}
                                className="block w-full rounded-lg bg-[#121827] text-white text-center items-center justify-center cursor-pointer required:border-red-500 valid:border-green-500 max-[1600px]: "
                                onChange={(e) =>
                                    setData("tipo_id", e.target.value)
                                }
                                placeholder="tipo"
                                required
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
                                message={errors.tipo_id}
                                className="mt-2"
                            />
                        </div>

                        <div className="w-1/3 flex flex-col items-center max-[1600px]:w-full">
                            <InputLabel
                                htmlFor="fecha"
                                value="Fecha"
                                className={clasesLabel}
                            />
                            <input
                                type="date"
                                id="fecha"
                                name="fecha"
                                className={`required:border-red-500 valid:border-green-500 ${clasesDOM}`}
                                onChange={(e) =>
                                    setData("fecha", e.target.value)
                                }
                                value={data.fecha}
                            />
                            <InputError
                                message={errors.fecha}
                                className="mt-2"
                            />
                        </div>

                        <div className="w-1/3 flex flex-col items-center max-[1600px]:w-full">
                            <InputLabel
                                htmlFor="hora"
                                value="Hora"
                                className={clasesLabel}
                            />
                            <input
                                type="time"
                                id="hora"
                                name="hora"
                                className={`required:border-red-500 valid:border-green-500 ${clasesDOM}`}
                                onChange={(e) =>
                                    setData("hora", e.target.value)
                                }
                                value={data.hora ?? "00:00"}
                            />
                            <InputError
                                message={errors.hora}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div className={clasesDivContainer}>
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
                                className="mt-1 block w-full"
                                onChange={(e) =>
                                    setData("nombre", e.target.value)
                                }
                                placeholder="Nombre"
                                autoComplete="off"
                                required
                            />
                            <InputError
                                message={errors.frecuencia}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div className={clasesDivContainer}>
                        <div className="w-full">
                            <InputLabel
                                htmlFor="observaciones"
                                value="Observaciones"
                                className={clasesLabel}
                            />
                            <textarea
                                id="observaciones"
                                name="observaciones"
                                className={`required:border-red-500 valid:border-green-500 ${clasesDOM}`}
                                onChange={(e) =>
                                    setData("observaciones", e.target.value)
                                }
                                autoComplete="off"
                                placeholder="observaciones"
                                value={data.observaciones ?? ""}
                                required
                            ></textarea>
                            <InputError
                                message={errors.observaciones}
                                className="mt-2"
                            />
                        </div>
                    </div>
                </fieldset>
            </div>

            <div className={classZona}>
                <legend className={clasesLegend}>Frecuencia</legend>
                <fieldset name="frecuencia" className={clasesFieldSet}>
                    <div className={clasesDivContainer}>
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
                                className="mt-1 block w-full"
                                onChange={(e) =>
                                    setData("frecuencia", e.target.value)
                                }
                                autoComplete="off"
                                placeholder="Frecuencia"
                                required
                            />
                            <InputError
                                message={errors.frecuencia}
                                className="mt-2"
                            />
                        </div>
                    </div>
                    <div className={clasesDivContainer}>
                        <div className="w-full">
                            <InputLabel
                                htmlFor="banda_id"
                                value="Banda"
                                className={clasesLabel}
                            />
                            <select
                                id="banda_id"
                                name="banda_id"
                                value={data.banda_id}
                                className="mt-1 block w-full rounded-lg bg-[#121827] text-white text-center items-center justify-center cursor-pointer"
                                onChange={(e) =>
                                    setData("banda_id", e.target.value)
                                }
                                placeholder="Banda"
                                required
                            >
                                {Object.entries(bandas).map(([id, banda]) => (
                                    <option
                                        key={id} // Asegúrate de agregar una clave única para cada opción
                                        className="mt-1 block w-full bg-[#121827] cursor-pointer"
                                        value={id ?? -1}
                                    >
                                        {banda}
                                    </option>
                                ))}
                            </select>

                            <InputError
                                message={errors.banda}
                                className="text-center"
                            />
                        </div>

                        <div className="w-full">
                            <InputLabel
                                htmlFor="modo_id"
                                value="Modo TX"
                                className={clasesLabel}
                            />
                            <select
                                id="modo_id"
                                name="modo_id"
                                value={data.modo_id}
                                className="mt-1 block w-full rounded-lg bg-[#121827] text-white text-center items-center justify-center cursor-pointer"
                                onChange={(e) =>
                                    setData("modo_id", e.target.value)
                                }
                                placeholder="Modo Transmision"
                                required
                            >
                                {Object.entries(modos).map(([id, modo]) => (
                                    <option
                                        key={id} // Asegúrate de agregar una clave única para cada opción
                                        className="mt-1 block w-full bg-[#121827] cursor-pointer"
                                        value={id ?? -1}
                                    >
                                        {modo}
                                    </option>
                                ))}
                            </select>

                            <InputError
                                message={errors.modo_id}
                                className="mt-2"
                            />
                        </div>

                        <div className="w-full">
                            <InputLabel
                                htmlFor="calidad"
                                value="Calidad"
                                className={clasesLabel}
                            />
                            <input
                                type="number"
                                id="calidad"
                                name="calidad"
                                value={data.calidad}
                                className={`required:border-red-500 valid:border-green-500 ${clasesDOM}`}
                                min={0}
                                max={5}
                                step={1}
                                onChange={(e) =>
                                    setData("calidad", e.target.value)
                                }
                                placeholder="Calidad"
                                required
                            />
                            <InputError
                                message={errors.calidad}
                                className="mt-2"
                            />
                        </div>
                    </div>
                </fieldset>
            </div>

            <div className={classZona}>
                <legend
                    className={clasesLegend}
                    onClick={() => handleToggleVisibilidad("locVisib")}
                >
                    <span>Localización</span>
                    <i className="fa-solid fa-location-dot"></i>
                </legend>
                {visibilidad.locVisib ? (
                    <>
                        <fieldset
                            name="localizacion"
                            className={clasesFieldSet}
                        >
                            <div className={clasesDivContainer}>
                                <div className="w-1/3 flex flex-col items-center max-[1600px]:w-full">
                                    <InputLabel
                                        htmlFor="localizacion_id"
                                        value="Localidad"
                                        className={clasesLabel}
                                    />
                                    <TextInput
                                        id="localidad"
                                        name="localidad"
                                        value={data.localidad ?? ""}
                                        className="mt-1 block w-full text-center"
                                        onChange={(e) =>
                                            setData("localidad", e.target.value)
                                        }
                                        autoComplete="off"
                                        placeholder="Localidad"
                                        required
                                    />

                                    <InputError
                                        message={errors.localidad}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="w-1/3 flex flex-col items-center max-[1600px]:w-full">
                                    <InputLabel
                                        htmlFor="provincia"
                                        value="Provincia"
                                        className={clasesLabel}
                                    />
                                    <TextInput
                                        id="provincia"
                                        name="provincia"
                                        value={data.provincia ?? ""}
                                        className="mt-1 block w-full text-center max-[1600px]:w-full"
                                        onChange={(e) =>
                                            setData("provincia", e.target.value)
                                        }
                                        placeholder="Provincia"
                                        autoComplete="off"
                                        required
                                    />

                                    <InputError
                                        message={errors.localidad}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="w-1/3 flex flex-col items-center max-[1600px]:w-full">
                                    <InputLabel
                                        htmlFor="pais"
                                        value="Pais"
                                        className={clasesLabel}
                                    />
                                    <TextInput
                                        id="pais"
                                        name="pais"
                                        value={data.pais ?? ""}
                                        className="mt-1 block w-full text-center max-[1600px]:w-full"
                                        onChange={(e) =>
                                            setData("pais", e.target.value)
                                        }
                                        placeholder="pais"
                                        autoComplete="off"
                                        required
                                    />

                                    <InputError
                                        message={errors.pais}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                            <div className={clasesDivContainer}>
                                <div className="w-full flex flex-col items-center">
                                    <InputLabel
                                        htmlFor="gps"
                                        value="GPS"
                                        className={clasesLabel}
                                    />
                                    <TextInput
                                        id="gps"
                                        name="gps"
                                        value={data.gps ?? ""}
                                        className="mt-1 block w-full text-center max-[1600px]:w-full"
                                        autoComplete="off"
                                        onChange={(e) =>
                                            setData("gps", e.target.value)
                                        }
                                        placeholder="gps"
                                    />

                                    <InputError
                                        message={errors.gps}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        </fieldset>
                    </>
                ) : (
                    <i
                        className={clasesAgregar}
                        onClick={() => handleToggleVisibilidad("locVisib")}
                    ></i>
                )}
            </div>

            <div className={classZona}>
                <legend
                    className={clasesLegend}
                    onClick={() => handleToggleVisibilidad("repVisib")}
                >
                    <span>Repetidor</span>
                    <span></span>

                    <i className="fa-solid fa-tower-cell"></i>
                </legend>
                {visibilidad.repVisib ? (
                    <>
                        <fieldset name="repetidor" className={clasesFieldSet}>
                            <div className={clasesDivContainer}>
                                <div className="w-1/3 max-[1600px]:w-full">
                                    <InputLabel
                                        htmlFor="direccion"
                                        value="Dirección"
                                        className={clasesLabel}
                                    />
                                    <select
                                        id="direccion"
                                        name="direccion"
                                        value={data.direccion}
                                        className="block w-full rounded-lg bg-[#121827] text-white text-center items-center justify-center cursor-pointer"
                                        onChange={(e) =>
                                            setData("direccion", e.target.value)
                                        }
                                        placeholder="Dirección"
                                        required
                                    >
                                        {Object.entries(direcciones).map(
                                            ([id, nombre]) => (
                                                <option
                                                    key={id} // Asegúrate de agregar una clave única para cada opción
                                                    className="mt-1 block w-full bg-[#121827] cursor-pointer"
                                                    value={id}
                                                >
                                                    {nombre}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>
                                <div className="w-1/3 max-[1600px]:w-full">
                                    <InputLabel
                                        htmlFor="offset"
                                        value="Offset"
                                        className={clasesLabel}
                                    />
                                    <TextInput
                                        id="offset"
                                        name="offset"
                                        value={data.offset ?? ""}
                                        className="mt-1 block w-full text-center"
                                        autoComplete="off"
                                        onChange={(e) =>
                                            setData(
                                                "offset",
                                                e.target.value ?? ""
                                            )
                                        }
                                        placeholder="Offset"
                                        required
                                    />
                                    <InputError
                                        message={errors.offset}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        </fieldset>
                    </>
                ) : (
                    <i
                        className={clasesAgregar}
                        onClick={() => handleToggleVisibilidad("repVisib")}
                    ></i>
                )}
            </div>

            <div className={classZona}>
                <legend
                    className={clasesLegend}
                    onClick={() => handleToggleVisibilidad("codVisib")}
                >
                    <span>Codificación</span>
                    <i className="fa-solid fa-barcode"></i>
                </legend>

                {visibilidad.codVisib ? (
                    <>
                        <fieldset
                            name="codificacion"
                            className={clasesFieldSet}
                        >
                            <div className={clasesDivContainer}>
                                <div className="w-1/3 flex flex-col items-center max-[1600px]:w-full">
                                    <InputLabel
                                        htmlFor="tipo_codificacion_id"
                                        value="Codificación"
                                        className={clasesLabel}
                                    />
                                    <select
                                        id="tipo_codificacion_id"
                                        name="tipo_codificacion_id"
                                        value={data.tipo_codificacion_id ?? -1}
                                        className="ml-4 block w-full rounded-lg bg-[#121827] text-white text-center items-center justify-center cursor-pointer"
                                        onChange={(e) =>
                                            setData(
                                                "tipo_codificacion_id",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Codificación"
                                        required
                                    >
                                        {Object.entries(codificaciones).map(
                                            ([id, nombre]) => (
                                                <option
                                                    key={id} // Asegúrate de agregar una clave única para cada opción
                                                    className="mt-1 block w-full bg-[#121827] cursor-pointer"
                                                    value={id}
                                                >
                                                    {nombre}
                                                </option>
                                            )
                                        )}
                                    </select>

                                    <InputError
                                        message={errors.codificacion}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="w-1/3 flex flex-col items-center max-[1600px]:w-full">
                                    <InputLabel
                                        htmlFor="ctcss_id"
                                        value="CTCSS"
                                        className={clasesLabel}
                                    />
                                    <select
                                        id="ctcss_id"
                                        name="ctcss_id"
                                        value={data.ctcss_id ?? -1}
                                        className="ml-4 block w-full rounded-lg bg-[#121827] text-white text-center items-center justify-center cursor-pointer"
                                        onChange={(e) =>
                                            setData("ctcss_id", e.target.value)
                                        }
                                        placeholder="CTCSS"
                                        required
                                    >
                                        {Object.entries(ctcss).map(
                                            ([id, codigo]) => (
                                                <option
                                                    key={id} // Asegúrate de agregar una clave única para cada opción
                                                    className="mt-1 block w-full bg-[#121827] cursor-pointer"
                                                    value={id}
                                                >
                                                    {codigo}
                                                </option>
                                            )
                                        )}
                                    </select>

                                    <InputError
                                        message={errors.ctcss}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="w-1/3 flex flex-col items-center max-[1600px]:w-full">
                                    <InputLabel
                                        htmlFor="dcs_id"
                                        value="DCS"
                                        className={clasesLabel}
                                    />
                                    <select
                                        id="dcs_id"
                                        name="dcs_id"
                                        value={data.dcs_id ?? -1}
                                        className="ml-4 block w-full rounded-lg bg-[#121827] text-white text-center items-center justify-center cursor-pointer"
                                        onChange={(e) =>
                                            setData("dcs_id", e.target.value)
                                        }
                                        placeholder="DCS"
                                        required
                                    >
                                        {Object.entries(dcs).map(
                                            ([id, codigo]) => (
                                                <option
                                                    key={id} // Asegúrate de agregar una clave única para cada opción
                                                    className="mt-1 block w-full bg-[#121827] cursor-pointer"
                                                    value={id}
                                                >
                                                    {codigo}
                                                </option>
                                            )
                                        )}
                                    </select>

                                    <InputError
                                        message={errors.ctcss}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        </fieldset>
                    </>
                ) : (
                    <i
                        className={clasesAgregar}
                        onClick={() => handleToggleVisibilidad("codVisib")}
                    ></i>
                )}
            </div>
        </form>
    );
};
