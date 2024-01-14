import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";
import { useEffect } from "react";

export const EditarContacto = ({
    datos,
    tipos_contacto,
    handleOpen,
    bandas,
    modos,
    codificaciones,
    dcs,
    ctcss,
}) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        id: datos.id,
        frecuencia: datos.frecuencia.frecuencia,
        nombre: datos.nombre,
        observaciones: datos?.observaciones,
        comprobado: datos.comprobado,
        hora: datos?.hora,
        fecha: datos.fecha,
        tipo_id: datos.tipo.id,
        banda_id: datos.frecuencia.banda_id,
        modo_id: datos.frecuencia.modo_id,
        calidad: datos.frecuencia.calidad,
        repetidor: datos.frecuencia.repetidor_id,
        offset: datos.frecuencia?.repetidor?.offset,
        direccion: datos.frecuencia?.repetidor?.direccion,
        codificacion_id: datos.frecuencia?.codificacion_id,
        codificacion: datos.frecuencia?.codificacion?.tipo?.nombre,
        dcs_id: datos.frecuencia?.codificacion?.dcs_id,
        ctcss_id: datos.frecuencia?.codificacion?.ctcss_id,
    });

    // Variables para setear los estilos de algunas zonas

    const clasesDOM = "mt-1 block w-full rounded-lg bg-[#121827] text-gray-200";
    const clasesLegend = "text-xl font-bold mt-5 p-2";
    const clasesFieldSet =
        "p-4 w-full flex flex-col items-center justify-start border-2 border-blue-300 shadow-[inset_0_0_10px_black] rounded-lg";
    const clasesDivContainer =
        "flex flex-row w-4/5 place-content-center gap-10 m-2 items-center";
    const clasesLabel = "text-center mb-2";

    
    // Métodos / Hooks

    const submit = (e) => {
        e.preventDefault();
        post(route("contacto_actualizar", [(id) => datos.id]));
    };

    const handleCheck = (e) => {
        let value = e.target.value;
        const comprobado = document.getElementById("comprobado");

        switch (value) {
            case "1":
                setData("comprobado", "");
                comprobado.checked = "";
                break;
            default:
                setData("comprobado", 1);
                comprobado.checked = 1;
        }
    };

    const handleTipo = (e) => {
        let value = e.target.value;
        setData("tipo_id", value);
    };

    const handleBanda = (e) => {
        let value = e.target.value;
        setData("banda_id", value);
    };

    const handleCodificacion = (e) => {
        let value = e.target.value;
        setData("codificacion_id", value);
    };

    const handleCtcss = (e) => {
        let value = e.target.value;
        setData("ctcss_id", value);
    };

    return (
        <form
            method="POST"
            onSubmit={submit}
            encType="multipart/form-data"
            className="flex flex-col justify-start items-center w-3/4 mx-auto min-h-screen bg-gradient-to-t bg-blue-700 from-blue-950 shadow-[inset_0_0_30px_rgba(00,0,10,0.9)]"
        >
            <header className="my-[50px] w-4/5 h-[80px]  text-gray-200 bg-gradient-to-b from-blue-900 bg-blue-300 flex items-center justify-center shadow-inner  rounded-md">
                <h2 className="font-bold text-2xl">
                    Editar contacto {datos.nombre} |{" "}
                    {datos.frecuencia.frecuencia}
                </h2>
            </header>
            <input type="hidden" id="id" value={data.id} />

            <legend className={clasesLegend}>Datos</legend>
            <fieldset name="datos" className={clasesFieldSet}>
                <div className={clasesDivContainer}>
                    <div className="w-full flex flex-row gap-5">
                        <InputLabel htmlFor="comprobado" value="Comprobado" />
                        <Checkbox
                            id="comprobado"
                            name="comprobado"
                            className="mt-1 block"
                            onChange={(e) => handleCheck(e)}
                            value={data.comprobado}
                            checked={data.comprobado ? "on" : ""}
                        />
                        <InputError
                            message={errors.observaciones}
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
                                        value={id}
                                    >
                                        {tipo}
                                    </option>
                                )
                            )}
                        </select>

                        <InputError message={errors.tipo} className="mt-2" />
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
                            onChange={(e) => setData("fecha", e.target.value)}
                            value={data.fecha}
                        />
                        <InputError message={errors.fecha} className="mt-2" />
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
                            onChange={(e) => setData("hora", e.target.value)}
                            value={data.hora ?? "00:00"}
                        />
                        <InputError message={errors.hora} className="mt-2" />
                    </div>
                </div>

                <div className={clasesDivContainer}>
                    <div className="w-full">
                        <InputLabel htmlFor="nombre" value="Nombre" />
                        <TextInput
                            id="nombre"
                            name="nombre"
                            value={data.nombre}
                            className="mt-1 block w-full"
                            isFocused={true}
                            onChange={(e) => setData("nombre", e.target.value)}
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
                        />
                        <textarea
                            id="observaciones"
                            name="observaciones"
                            className={clasesDOM}
                            onChange={(e) =>
                                setData("observaciones", e.target.value)
                            }
                            placeholder="observaciones"
                            value={data.observaciones}
                            required
                        ></textarea>
                        <InputError
                            message={errors.observaciones}
                            className="mt-2"
                        />
                    </div>
                </div>
            </fieldset>

            <legend className={clasesLegend}>Frecuencia</legend>
            <fieldset name="frecuencia" className={clasesFieldSet}>
                <div className={clasesDivContainer}>
                    <div className="w-full">
                        <InputLabel htmlFor="frecuencia" value="Frecuencia" />
                        <TextInput
                            id="frecuencia"
                            name="frecuencia"
                            value={data.frecuencia}
                            className="mt-1 block w-full"
                            isFocused={true}
                            onChange={(e) =>
                                setData("frecuencia", e.target.value)
                            }
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
                            className="text-center"
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
                                    value={id}
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
                            className="text-center"
                        />
                        <select
                            id="modo_id"
                            name="modo_id"
                            value={data.modo_id}
                            className="mt-1 block w-full rounded-lg bg-[#121827] text-white text-center items-center justify-center cursor-pointer"
                            onChange={(e) => handleBanda(e)}
                            placeholder="Modo Transmision"
                            required
                        >
                            {Object.entries(modos).map(([id, modo]) => (
                                <option
                                    key={id} // Asegúrate de agregar una clave única para cada opción
                                    className="mt-1 block w-full bg-[#121827] cursor-pointer"
                                    value={id}
                                >
                                    {modo}
                                </option>
                            ))}
                        </select>

                        <InputError message={errors.modo} className="mt-2" />
                    </div>

                    <div className="w-full">
                        <InputLabel
                            htmlFor="calidad"
                            value="Calidad"
                            className="text-center"
                        />
                        <TextInput
                            id="calidad"
                            name="calidad"
                            value={data.calidad}
                            className="mt-1 block w-full text-center"
                            isFocused={true}
                            onChange={(e) => setData("calidad", e.target.value)}
                            placeholder="Calidad"
                            required
                        />
                        <InputError message={errors.calidad} className="mt-2" />
                    </div>
                </div>
            </fieldset>

            {datos.frecuencia.repetidor_id ? (
                <>
                    <legend className={clasesLegend}>Repetidor</legend>
                    <fieldset name="repetidor" className={clasesFieldSet}>
                        <div className={clasesDivContainer}>
                            <div className="w-full">
                                <InputLabel htmlFor="offset" value="Offset" />
                                <TextInput
                                    id="offset"
                                    name="offset"
                                    value={data.offset ?? null}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData("offset", e.target.value)
                                    }
                                    placeholder="Offset"
                                    required
                                />
                                <InputError
                                    message={errors.offset}
                                    className="mt-2"
                                />
                            </div>
                            <div className="w-full">
                                <InputLabel
                                    htmlFor="direccion"
                                    value="Dirección"
                                />
                                <TextInput
                                    id="direccion"
                                    name="direccion"
                                    value={data.direccion ?? null}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData("direccion", e.target.value)
                                    }
                                    placeholder="direccion"
                                    required
                                />
                                <InputError
                                    message={errors.direccion}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                    </fieldset>
                </>
            ) : (
                ""
            )}

            {datos.frecuencia.codificacion_id ? (
                <>
                    <legend className={clasesLegend}>Codificación</legend>
                    <fieldset name="codificacion" className={clasesFieldSet}>
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
                                    value={data.codificacion_id}
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
                ""
            )}

            <div className="w-4/5 flex items-center justify-end mt-4 p-2 gap-10">
                <PrimaryButton
                    className="ml-4  bg-blue-600"
                    disabled={processing}
                    onClick={submit}
                >
                    Actualizar Contacto
                </PrimaryButton>

                <SecondaryButton
                    className="ml-4 bg-red-500"
                    disabled={processing}
                    onClick={handleOpen}
                >
                    Salir
                </SecondaryButton>
            </div>
        </form>
    );
};
