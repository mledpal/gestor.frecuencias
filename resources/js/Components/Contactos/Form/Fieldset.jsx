export const Fieldset = () => {
    return (
        <>
            <legend className={clasesLegend}>Datos</legend>
            <fieldset name="datos" className={clasesFieldSet}>
                <div className={clasesDivContainer}>
                    <div className="w-full flex flex-row gap-5">
                        <InputLabel
                            htmlFor="comprobado"
                            value="Comprobado"
                            className={clasesLabel}
                        />
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
        </>
    );
};
