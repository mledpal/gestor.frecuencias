import React from "react";
import { useState } from "react";
import { Dialog } from "@material-tailwind/react";
import { useMediaQuery } from "@react-hook/media-query";

import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";

import { handlerForm } from "../Helpers/handlerForm";

import { handleContacts } from "../Helpers/handleContacts";

import { GpsMap } from "@/Components/GPSMap/GpsMap";

import { BotonesFormulario } from "@/Components/BotonesFormulario/BotonesFormulario";

export const EditarContacto = ({
    setDatos,
    contactos,
    datos,
    selects,
    borrarContacto,
    updateContact,
    userDB,
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

    const isSmallScreen = useMediaQuery("(max-width: 900px)");

    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(!open); // Cambia el valor de open a su opuesto
    };

    const {
        submit,
        handleDelete,
        handleAddContact,
        data,
        setData,
        coordenadas,
        errors,
    } = handleContacts({
        isSmallScreen,
        datos,
        setDatos,
        contactos,
        updateContact,
        borrarContacto,
    });

    const {
        handleCheck,
        handlePrivado,
        handleFavorito,
        handleToggleVisibilidad,
        visibilidad,
    } = handlerForm({ datos, setData });

    // Variables para setear los estilos de algunas zonas

    const claseContacto = `flex flex-col justify-start items-center w-full mx-auto min-h-screen bg-sky-900`;

    const classZona = `${
        isSmallScreen ? "w-screen" : "w-4/5"
    } flex flex-col items-center m-4 rounded-2xl border-2 border-blue-950 shadow-lg`;
    const clasesDOM =
        "mt-1 block w-full rounded-lg bg-[#121827] text-gray-200 text-center";
    const clasesLegend =
        "w-full bg-blue-950 max-w-screen-desktop:text-xl text-sm max-[1280px]:text-sm font-bold p-2 select-none cursor-pointer flex flex-row items-center justify-center gap-10 p-5 rounded-t-xl ";
    const clasesFieldSet =
        "p-4 w-full flex flex-col items-center justify-start mb-2 max-[1280px]:text-[.8rem]";
    const clasesDivContainer = `flex w-4/5 place-content-center gap-2 m-2 items-center ${
        isSmallScreen ? "flex-col" : "flex-row"
    } `;
    const clasesLabel =
        "text-center mb-1 text-white select-none max-[1280px]:text-[.8rem] ";
    const clasesAgregar =
        "rounded-full transition shadow-[inset_0_0_5px_rgba(0,0,0,.5)] hover:bg-lime-500 hover:shadow-[0_0_5px_rgba(255,255,255,.5)] ease-in transition:ease-out duration-100 m-2 fa-solid fa-plus cursor-pointer select-none p-3";

    return (
        <>
            <form
                method="POST"
                onSubmit={submit}
                encType="multipart/form-data"
                className={claseContacto}
            >
                <input type="hidden" id="id" value={data.id} />
                <div
                    className={`w-full gap-2 flex-col sticky top-0 h-[125px]  bg-gradient-to-b from-${datos.tipo.color} to-slate-900 to-75%  z-10 flex items-center justify-center mt-0 p-5 relative`}
                >
                    <div
                        className={` w-full flex flex-row gap-2 items-center justify-center text-center`}
                    >
                        <h2 className="font-bold max-w-screen-desktop:text-xl text-lg">
                            {datos.nombre}
                        </h2>
                        <span className="text-xs text-gray-300">
                            {datos.frecuencia.frecuencia} Mhz
                        </span>
                        <span className="italic text-xs text-gray-300">
                            {datos.tipo.nombre}
                        </span>
                    </div>

                    <div
                        name="guardar_datos"
                        className={` max-[1500px]:w-full w-1/2 flex items-center justify-around `}
                    >
                        {datos.user_id === userDB.id && (
                            <BotonesFormulario
                                actionSubmit={submit}
                                textSubmit={"Guardar"}
                                actionReset={() => handleDelete(datos.id)}
                                textReset={"Eliminar"}
                                colorReset={"bg-red-700"}
                                classText={` ${
                                    isSmallScreen ? "text-[.7rem]" : ""
                                }`}
                            />
                        )}
                        <BotonesFormulario
                            actionExit={() => setDatos(null)}
                            textExit={"Salir"}
                            colorExit={"bg-green-700"}
                            classText={` ${
                                isSmallScreen ? "text-[.7rem]" : ""
                            }`}
                        />
                        {datos.user_id !== userDB.id && (
                            <BotonesFormulario
                                actionSubmit={handleAddContact}
                                textSubmit={"Agregar"}
                                classText={` ${
                                    isSmallScreen ? "text-[.7rem]" : ""
                                }`}
                            />
                        )}
                    </div>

                    <div
                        name="otrosIconos"
                        className="absolute top-2 right-2 p-2 h-[75px] flex flex-col items-end justify-between"
                    >
                        {datos.localizacion?.gps && (
                            <i
                                className="fa-solid fa-location-dot cursor-pointer hover:scale-150 duration-150 select-none"
                                onClick={handleOpen}
                            ></i>
                        )}
                    </div>
                </div>

                {datos.user_id !== userDB.id ? (
                    <div
                        className={`${
                            isSmallScreen ? "w-full" : "w-4/5"
                        } bg-black flex flex-row items-center justify-center p-4 gap-5`}
                    >
                        <img
                            className="w-[30px] h-[30px] rounded-full"
                            src={datos.usuario.photo}
                        />
                        <span className="text-xs">
                            {datos.usuario.username}
                        </span>
                    </div>
                ) : (
                    ""
                )}

                <div className={classZona}>
                    <legend className={clasesLegend}>Datos</legend>
                    <fieldset name="datos" className={clasesFieldSet}>
                        <div className={clasesDivContainer}>
                            <div className="w-full flex flex-col items-center max-w-screen-desktop:justify-center justify-end">
                                {" "}
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

                            <div className="w-full flex flex-col items-center max-w-screen-desktop:justify-center justify-end">
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

                            <div className="w-full flex flex-col items-center max-w-screen-desktop:justify-center justify-end">
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
                            <div className="w-full flex flex-col items-center max-w-screen-desktop:w-1/3">
                                <InputLabel
                                    htmlFor="tipo_id"
                                    value="Tipo"
                                    className={clasesLabel}
                                />

                                <select
                                    id="tipo_id"
                                    name="tipo_id"
                                    value={data.tipo_id}
                                    className="mt-1 block w-full rounded-lg bg-[#121827] text-white text-center items-center justify-center cursor-pointer"
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
                                    message={errors.tipo}
                                    className="mt-2"
                                />
                            </div>

                            <div className="w-full flex flex-col items-center max-w-screen-desktop:w-1/3">
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

                            <div className="w-full flex flex-col items-center max-w-screen-desktop:w-1/3">
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
                                    className="block w-full text-center font-bold"
                                    onChange={(e) =>
                                        setData("nombre", e.target.value)
                                    }
                                    placeholder="Nombre"
                                    required
                                />
                                <InputError
                                    message={errors.nombre}
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
                                    className="block w-full text-center"
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
                                    value={data.banda_id ?? -1}
                                    className="mt-1 block w-full rounded-lg bg-[#121827] text-white text-center items-center justify-center cursor-pointer"
                                    onChange={(e) =>
                                        setData("banda_id", e.target.value)
                                    }
                                    placeholder="Banda"
                                >
                                    {Object.entries(bandas).map(
                                        ([id, banda]) => (
                                            <option
                                                key={id} // Asegúrate de agregar una clave única para cada opción
                                                className="mt-1 block w-full bg-[#121827] cursor-pointer"
                                                value={id ?? -1}
                                            >
                                                {banda}
                                            </option>
                                        )
                                    )}
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
                                    value={data.modo_id ?? -1}
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
                                    <div className="w-full flex flex-col items-center max-w-screen-desktop:w-1/3">
                                        <InputLabel
                                            htmlFor="localizacion_id"
                                            value="Localidad"
                                            className={clasesLabel}
                                        />
                                        <TextInput
                                            id="localidad"
                                            name="localidad"
                                            value={data.localidad ?? ""}
                                            className="mt-1 block w-full text-center "
                                            onChange={(e) =>
                                                setData(
                                                    "localidad",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Localidad"
                                            required
                                        />

                                        <InputError
                                            message={errors.localidad}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="w-full flex flex-col items-center max-w-screen-desktop:w-1/3">
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
                                            onChange={(e) =>
                                                setData(
                                                    "provincia",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Provincia"
                                            required
                                        />

                                        <InputError
                                            message={errors.localidad}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="w-full flex flex-col items-center max-w-screen-desktop:w-1/3">
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
                                    <div className="w-full flex flex-col items-center max-w-screen-desktop:w-1/3">
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
                                ? (() => {
                                      switch (datos.repetidor.direccion) {
                                          case "+":
                                          case "-":
                                              return eval(
                                                  datos.frecuencia.frecuencia +
                                                      datos.repetidor
                                                          ?.direccion +
                                                      datos.repetidor?.offset
                                              ).toFixed(4);
                                          default:
                                              return datos.frecuencia
                                                  .frecuencia;
                                              break;
                                      }
                                  })()
                                : ""}
                        </span>

                        <i className="fa-solid fa-tower-cell"></i>
                    </legend>
                    {datos.repetidor_id || visibilidad.repVisib ? (
                        <>
                            <fieldset
                                name="repetidor"
                                className={clasesFieldSet}
                            >
                                <div className={clasesDivContainer}>
                                    <div className="w-full flex flex-col items-center max-w-screen-desktop:w-1/3">
                                        <InputLabel
                                            htmlFor="direccion"
                                            value="Dirección"
                                            className={clasesLabel}
                                        />
                                        <select
                                            id="direccion"
                                            name="direccion"
                                            value={data.direccion ?? "="}
                                            className="block w-full rounded-lg bg-[#121827] text-white text-center items-center justify-center cursor-pointer"
                                            onChange={(e) =>
                                                setData(
                                                    "direccion",
                                                    e.target.value
                                                )
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
                                    <div className="w-full flex flex-col items-center max-w-screen-desktop:w-1/3">
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
                                    <div className="w-full flex flex-col items-center max-w-screen-desktop:w-1/3">
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
                                            onChange={(e) =>
                                                setData(
                                                    "codificacion_id",
                                                    e.target.value
                                                )
                                            }
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

                                    <div className="w-full flex flex-col items-center max-w-screen-desktop:w-1/3">
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
                                                setData(
                                                    "ctcss_id",
                                                    e.target.value
                                                )
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

                                    <div className="w-full flex flex-col items-center max-w-screen-desktop:w-1/3">
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
                                                setData(
                                                    "dcs_id",
                                                    e.target.value
                                                )
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

            <Dialog
                id="googlegps"
                name="googlegps"
                size="xxl"
                open={open}
                handler={handleOpen}
                className="w-screen min-h-screen bg-transparent shadow-transparent m-auto  overflow-y-auto"
            >
                <GpsMap
                    coordenadas={coordenadas}
                    nombre={datos.nombre}
                    handleOpen={handleOpen}
                />
            </Dialog>
        </>
    );
};
