import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import AlertButton from "@/Components/AlertButton";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useEffect, useState } from "react";

export const EditarContacto = ({
    datos,
    tipos_contacto,
    handleOpen,
    bandas,
    modos,
    codificaciones,
    dcs,
    ctcss,
    direcciones,
}) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        id: datos.id,
        frecuencia: datos.frecuencia.frecuencia,
        nombre: datos.nombre,
        observaciones: datos?.observaciones,
        comprobado: datos.comprobado,
        frecuencia_id: datos.frecuencia_id,
        hora: datos?.hora,
        fecha: datos.fecha,
        tipo_id: datos.tipo.id,
        banda_id: datos.frecuencia.banda_id,
        modo_id: datos.frecuencia.modo_id,
        calidad: datos.frecuencia.calidad,
        offset: datos.frecuencia?.repetidor?.offset,
        direccion: datos.frecuencia?.repetidor?.direccion,
        codificacion_id: datos.frecuencia?.codificacion_id,
        dcs_id: datos.frecuencia?.codificacion?.dcs_id,
        ctcss_id: datos.frecuencia?.codificacion?.ctcss_id,
        localizacion_id: datos.localizacion_id,
        localidad: datos.localizacion?.localidad,
        provincia: datos.localizacion?.provincia,
        pais: datos.localizacion?.pais,
        gps: datos.localizacion?.gps,
    });

    useEffect(() => {
        setVisibilidad((prevVisibilidad) => ({
            ...prevVisibilidad,
            repVisib: datos.frecuencia.repetidor_id ? true : false,
            codVisib: datos.frecuencia.codificacion_id ? true : false,
            locVisib: datos.localizacion_id ? true : false,
        }));
    }, []);

    const [visibilidad, setVisibilidad] = useState({
        repVisib: false,
        codVisib: false,
        locVisib: false,
    });

    const handleToggleVisibilidad = (seccion) => {
        setVisibilidad((prevVisibilidad) => ({
            ...prevVisibilidad,
            [seccion]: !prevVisibilidad[seccion],
        }));
    };

    // Variables para setear los estilos de algunas zonas
    const clasesDOM =
        "mt-1 block w-full rounded-lg bg-[#121827] text-gray-200 text-center";
    const clasesLegend =
        "w-2/5 text-xl font-bold mt-5 p-2 select-none cursor-pointer flex flex-row items-center justify-around gap-10 p-5 shadow-[inset_0_0_4px_rgba(0,0,10,.9)] rounded-xl";
    const clasesFieldSet =
        "p-4 w-full flex flex-col items-center justify-start mb-2 border-b border-white";
    const clasesDivContainer =
        "flex flex-row w-4/5 place-content-center gap-10 m-2 items-center";
    const clasesLabel = "text-center mb-2 text-black select-none";
    const claseContacto = `flex flex-col justify-start items-center w-3/4 mx-auto min-h-screen shadow-[inset_0_0_30px_rgba(0,0,10,0.9)] ${datos.tipo.color}`;

    // Métodos / Hooks

    const MySwal = withReactContent(Swal);

    const submit = (e) => {
        e.preventDefault();
        post(route("contacto_actualizar", [(id) => datos.id]));
    };

    const deleteContact = (e) => {
        e.preventDefault();

        handleOpen();

        // Realiza la solicitud DELETE usando fetch
        fetch(`/contacto/${datos.id}/eliminar`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": document
                    .querySelector('meta[id="meta_token"]')
                    .getAttribute("content"),
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                console.log(response);
            })
            .catch((error) => {
                console.error(error);
            });
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

    const handleModo = (e) => {
        let value = e.target.value;
        setData("modo_id", value);
    };

    const handleCodificacion = (e) => {
        let value = e.target.value;
        setData("codificacion_id", value);
    };

    const handleCtcss = (e) => {
        let value = e.target.value;
        setData("ctcss_id", value);
    };

    const handleDcs = (e) => {
        let value = e.target.value;
        setData("dcs_id", value);
    };

    const handleDireccion = (e) => {
        let value = e.target.value;
        setData("direccion", value);
    };

    return (
        <form
            method="POST"
            onSubmit={submit}
            encType="multipart/form-data"
            className={claseContacto}
        >
            <header className="mt-10 mb-2 w-4/5 h-[80px]  text-gray-100 bg-gradient-to-b from-blue-900 bg-blue-500 flex items-center justify-center shadow-[inset_0_0_15px_black]  rounded-md select-none">
                <h2 className="font-bold text-2xl">
                    Editar contacto {datos.nombre} |{" "}
                    {datos.frecuencia.frecuencia}
                </h2>
            </header>
            <input type="hidden" id="id" value={data.id} />

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
                            onChange={(e) => setData("calidad", e.target.value)}
                            placeholder="Calidad"
                            required
                        />
                        <InputError message={errors.calidad} className="mt-2" />
                    </div>
                </div>
            </fieldset>

            <legend
                className={clasesLegend}
                onClick={() => handleToggleVisibilidad("locVisib")}
            >
                <span>Localización</span>
                <i className="fa-solid fa-location-dot"></i>
            </legend>
            {visibilidad.locVisib ? (
                <>
                    <fieldset name="localizacion" className={clasesFieldSet}>
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
                <p>No tiene</p>
            )}

            <legend
                className={clasesLegend}
                onClick={() => handleToggleVisibilidad("repVisib")}
            >
                <span>Repetidor</span><span>{datos.frecuencia.repetidor_id
                    ? eval(
                          datos.frecuencia.frecuencia +
                              datos.frecuencia?.repetidor?.direccion +
                              datos.frecuencia?.repetidor?.offset
                      ).toFixed(3)
                    : ""}</span>

                <i className="fa-solid fa-tower-cell"></i>
            </legend>
            {visibilidad.repVisib ? (
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
                                    value={data.offset ?? null}
                                    className="mt-1 block w-full text-center"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData("offset", e.target.value ?? "")
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
                <p>No tiene</p>
            )}

            <legend
                className={clasesLegend}
                onClick={() => handleToggleVisibilidad("codVisib")}
            >
                <span>Codificación</span>
                <i class="fa-solid fa-barcode"></i>
            </legend>

            {visibilidad.codVisib ? (
                <>
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
                                    {Object.entries(dcs).map(([id, codigo]) => (
                                        <option
                                            key={id} // Asegúrate de agregar una clave única para cada opción
                                            className="mt-1 block w-full bg-[#121827] cursor-pointer"
                                            value={id}
                                        >
                                            {codigo}
                                        </option>
                                    ))}
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
                <p>No tiene</p>
            )}

            <div className="border-t-2 border-white w-full flex items-center justify-center mt-4 p-5 gap-10">
                <PrimaryButton
                    className="ml-4  bg-blue-600"
                    disabled={processing}
                    onClick={submit}
                >
                    Actualizar Contacto
                </PrimaryButton>

                <AlertButton disabled={processing} onClick={deleteContact}>
                    Eliminar Contacto
                </AlertButton>

                <SecondaryButton disabled={processing} onClick={handleOpen}>
                    Salir
                </SecondaryButton>
            </div>
        </form>
    );
};
