import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";

import { handlerForm } from "./handlerForm";
import { useForm } from "@inertiajs/react";
import { useEffect } from "react";
import { handleContacts } from "./handleContacts";

export const EditarContacto = ({ datos, selects }) => {
    const {
        tipos_contacto,
        bandas,
        modos,
        codificaciones,
        dcs,
        ctcss,
        direcciones,
    } = selects;

    const { data, setData, post, processing, errors, reset } = useForm({
        id: datos.id,
        frecuencia: datos.frecuencia.frecuencia,
        nombre: datos.nombre,
        observaciones: datos?.observaciones,
        comprobado: datos.comprobado,
        privado: datos.privado,
        frecuencia_id: datos.frecuencia_id,
        hora: datos?.hora,
        fecha: datos?.fecha,
        tipo_id: datos.tipo.id,
        banda_id: datos.banda_id,
        modo_id: datos.modo_id,
        calidad: datos.calidad,
        offset: datos.repetidor?.offset,
        direccion: datos.repetidor?.direccion,
        codificacion_id: datos.codificacion_id,
        dcs_id: datos.codificacion?.dcs_id,
        ctcss_id: datos.codificacion?.ctcss_id,
        localizacion_id: datos.localizacion_id,
        localidad: datos.localizacion?.localidad,
        provincia: datos.localizacion?.provincia,
        pais: datos.localizacion?.pais,
        gps: datos.localizacion?.gps,
    });

    useEffect(() => {
        document.getElementById('detalle').scrollTo(0, 0);
    }, [datos]);

    useEffect(() => {
        setData({
            id: datos.id,
            frecuencia: datos.frecuencia.frecuencia,
            nombre: datos.nombre,
            observaciones: datos?.observaciones,
            comprobado: datos.comprobado,
            privado: datos.privado,
            frecuencia_id: datos.frecuencia_id,
            hora: datos?.hora,
            fecha: datos.fecha,
            tipo_id: datos.tipo.id,
            banda_id: datos.banda_id,
            modo_id: datos.modo_id,
            calidad: datos.calidad,
            offset: datos.repetidor?.offset,
            direccion: datos.repetidor?.direccion,
            codificacion_id: datos.codificacion_id,
            dcs_id: datos.codificacion?.dcs_id,
            ctcss_id: datos.codificacion?.ctcss_id,
            localizacion_id: datos.localizacion_id,
            localidad: datos.localizacion?.localidad,
            provincia: datos.localizacion?.provincia,
            pais: datos.localizacion?.pais,
            gps: datos.localizacion?.gps,
        });
    }, [datos]);

    const { submit, eliminar } = handleContacts(post);

    const {
        handleBanda,
        handleCheck,
        handlePrivado,
        handleCtcss,
        handleDcs,
        handleDireccion,
        handleModo,
        handleTipo,
        handleToggleVisibilidad,
        handleCodificacion,
        visibilidad,
        setVisibilidad,
    } = handlerForm({ datos, setData });

    // Variables para setear los estilos de algunas zonas

    const classZona =
        " w-4/5 flex flex-col items-center m-4 rounded-2xl border-2 border-blue-950 shadow-lg";
    const claseContacto = `flex flex-col justify-start items-center w-full mx-auto min-h-screen ] ${datos.tipo.color}`;
    const clasesDOM =
        "mt-1 block w-full rounded-lg bg-[#121827] text-gray-200 text-center";
    const clasesLegend =
        "w-full bg-blue-950 text-xl font-bold p-2 select-none cursor-pointer flex flex-row items-center justify-center gap-10 p-5 rounded-t-xl ";
    const clasesFieldSet =
        "p-4 w-full flex flex-col items-center justify-start mb-2 ";
    const clasesDivContainer =
        "flex flex-row w-4/5 place-content-center gap-10 m-2 items-center ";
    const clasesLabel = "text-center mb-2 text-black select-none";
    const clasesAgregar =
        "rounded-full transition shadow-[inset_0_0_5px_rgba(0,0,0,.5)] hover:bg-lime-500 hover:shadow-[0_0_5px_rgba(255,255,255,.5)] ease-in transition:ease-out duration-100 m-2 fa-solid fa-plus cursor-pointer select-none p-3";

    const clasesBotonesFormulario =
        "cursor-pointer hover:scale-150 duration-150 hover:ease-in ease-linear select-none";

    return (
        <form
            method="POST"
            onSubmit={submit}
            encType="multipart/form-data"
            className={claseContacto}
        >
            <div className="sticky top-0  bg-slate-900 z-10 w-4/5 flex items-center justify-center mt-0 p-5 gap-10">
                <div
                    name="guardar_datos"
                    className="w-1/5 flex items-center gap-8"
                >
                    <i
                        className={`fa-solid fa-floppy-disk text-white ${clasesBotonesFormulario}`}
                        onClick={submit}
                    ></i>

                    <i
                        className={`fa-solid fa-trash text-red-500 ${clasesBotonesFormulario}`}
                        onClick={() => eliminar(datos.id)}
                    ></i>
                </div>
                <div className="w-3/5 flex flex-col items-center justify-center">
                    <h2 className="font-bold text-xl">{datos.nombre}</h2>
                    <span className="text-sm">
                        {datos.frecuencia.frecuencia} Mhz
                    </span>
                    <span className="italic text-sm">{datos.tipo.nombre}</span>
                </div>

                <div
                    name="otrosIconos"
                    className="w-1/5 flex items-end justify-end"
                >
                    {datos.localizacion?.gps ? (
                        <i className="fa-solid fa-location-dot cursor-pointer hover:scale-150 select-none"></i>
                    ) : (
                        ""
                    )}
                </div>
            </div>

            <input type="hidden" id="id" value={data.id} />

            <div className={classZona}>
                <legend className={clasesLegend}>Datos</legend>
                <fieldset name="datos" className={clasesFieldSet}>
                    <div className={clasesDivContainer}>
                        <div className="w-full flex flex-row items-center justify-center">
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
                        <div className="w-full flex flex-row items-center justify-center">
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
                        <div className="w-1/3 flex flex-col items-center">
                            <InputLabel
                                htmlFor="tipo_id"
                                value="Tipo"
                                className={clasesLabel}
                            />
                            <select
                                id="tipo_id"
                                name="tipo_id"
                                value={data.tipo_id}
                                className="ml-4 block w-full rounded-lg bg-[#121827] text-white text-center items-center justify-center cursor-pointer"
                                onChange={(e) => handleTipo(e)}
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
                                message={errors.tipo}
                                className="mt-2"
                            />
                        </div>

                        <div className="w-1/3 flex flex-col items-center">
                            <InputLabel
                                htmlFor="fecha"
                                value="Fecha"
                                className={clasesLabel}
                            />
                            <input
                                type="date"
                                id="fecha"
                                name="fecha"
                                className={clasesDOM}
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

                        <div className="w-1/3 flex flex-col items-center">
                            <InputLabel
                                htmlFor="hora"
                                value="Hora"
                                className={clasesLabel}
                            />
                            <input
                                type="time"
                                id="hora"
                                name="hora"
                                className={clasesDOM}
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
                                isFocused={true}
                                onChange={(e) =>
                                    setData("nombre", e.target.value)
                                }
                                placeholder="Nombre"
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
                                className={clasesDOM}
                                onChange={(e) =>
                                    setData("observaciones", e.target.value)
                                }
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
                                className="mt-1 block w-full text-center"
                                isFocused={true}
                                onChange={(e) =>
                                    setData("frecuencia", e.target.value)
                                }
                                placeholder="Frecuencia"
                                disabled
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
                                onChange={(e) => handleBanda(e)}
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
                                onChange={(e) => handleModo(e)}
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
                                message={errors.modo}
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
                                className={clasesDOM}
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
                {datos.localizacion_id || visibilidad.locVisib ? (
                    <>
                        <fieldset
                            name="localizacion"
                            className={clasesFieldSet}
                        >
                            <div className={clasesDivContainer}>
                                <div className="w-1/3 flex flex-col items-center">
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
                                        isFocused={true}
                                        onChange={(e) =>
                                            setData("localidad", e.target.value)
                                        }
                                        placeholder="Localidad"
                                        required
                                    />

                                    <InputError
                                        message={errors.localidad}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="w-1/3 flex flex-col items-center">
                                    <InputLabel
                                        htmlFor="provincia"
                                        value="Provincia"
                                        className={clasesLabel}
                                    />
                                    <TextInput
                                        id="provincia"
                                        name="provincia"
                                        value={data.provincia ?? ""}
                                        className="mt-1 block w-full text-center"
                                        isFocused={true}
                                        onChange={(e) =>
                                            setData("provincia", e.target.value)
                                        }
                                        placeholder="Provincia"
                                        required
                                    />

                                    <InputError
                                        message={errors.localidad}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="w-1/3 flex flex-col items-center">
                                    <InputLabel
                                        htmlFor="pais"
                                        value="Pais"
                                        className={clasesLabel}
                                    />
                                    <TextInput
                                        id="pais"
                                        name="pais"
                                        value={data.pais ?? ""}
                                        className="mt-1 block w-full text-center"
                                        isFocused={true}
                                        onChange={(e) =>
                                            setData("pais", e.target.value)
                                        }
                                        placeholder="pais"
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
                                        className="mt-1 block w-full text-center"
                                        isFocused={true}
                                        onChange={(e) =>
                                            setData("gps", e.target.value)
                                        }
                                        placeholder="gps"
                                        required
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
                    <span>
                        {datos.repetidor_id
                            ? eval(
                                  datos.frecuencia.frecuencia +
                                      datos.repetidor?.direccion +
                                      datos.repetidor?.offset
                              ).toFixed(3)
                            : ""}
                    </span>

                    <i className="fa-solid fa-tower-cell"></i>
                </legend>
                {datos.repetidor_id || visibilidad.repVisib ? (
                    <>
                        <fieldset name="repetidor" className={clasesFieldSet}>
                            <div className={clasesDivContainer}>
                                <div className="w-1/3">
                                    <InputLabel
                                        htmlFor="direccion"
                                        value="Dirección"
                                        className={clasesLabel}
                                    />
                                    <select
                                        id="direccion"
                                        name="direccion"
                                        value={data.direccion}
                                        className="ml-4 block w-full rounded-lg bg-[#121827] text-white text-center items-center justify-center cursor-pointer"
                                        onChange={(e) => handleDireccion(e)}
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
                                <div className="w-1/3">
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
                                        isFocused={true}
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

                {visibilidad.codVisib || datos.codificacion_id ? (
                    <>
                        <fieldset
                            name="codificacion"
                            className={clasesFieldSet}
                        >
                            <div className={clasesDivContainer}>
                                <div className="w-1/3 flex flex-col items-center">
                                    <InputLabel
                                        htmlFor="codificacion_id"
                                        value="Codificación"
                                        className={clasesLabel}
                                    />
                                    <select
                                        id="codificacion_id"
                                        name="codificacion_id"
                                        value={data.codificacion_id ?? -1}
                                        className="ml-4 block w-full rounded-lg bg-[#121827] text-white text-center items-center justify-center cursor-pointer"
                                        onChange={(e) => handleCodificacion(e)}
                                        placeholder="Codificaación"
                                        required
                                    >
                                        {Object.entries(codificaciones).map(
                                            ([id, nombre]) => (
                                                <option
                                                    key={id} // Asegúrate de agregar una clave única para cada opción
                                                    className="mt-1 block w-full bg-[#121827] cursor-pointer"
                                                    value={id ?? -1}
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

                                <div className="w-1/3 flex flex-col items-center">
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
                                        onChange={(e) => handleCtcss(e)}
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

                                <div className="w-1/3 flex flex-col items-center">
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
                                        onChange={(e) => handleDcs(e)}
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
