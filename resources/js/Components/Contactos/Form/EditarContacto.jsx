import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";


export const EditarContacto = ({ datos, handleOpen }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        id: datos.id,
        frecuencia: datos.frecuencia.frecuencia,
        nombre: datos.nombre,
        observaciones: datos.observaciones,
        comprobado: datos.comprobado,
        fecha: datos.fecha,
        tipo: datos.tipo,
    });

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

    const handleSelect = (e) => {
        let value = e.target.value
        setData('tipo', value);
    }

    return (
        <form
            method="POST"
            onSubmit={submit}
            encType="multipart/form-data"
            className="flex flex-col justify-start items-center w-3/4 mx-auto h-1/2 bg-gradient-to-t bg-blue-950 from-blue-700 shadow-[inset_0_0_30px_rgba(00,0,10,0.9)]"
        >
            <header className="my-[50px] w-4/5 h-[80px] text-gray-200 bg-gradient-to-b from-blue-900 bg-blue-300 flex items-center justify-center shadow-inner  rounded-md">
                <h2 className="font-bold text-xl">
                    Editar contacto {datos.nombre} |{" "}
                    {datos.frecuencia.frecuencia}
                </h2>
            </header>
            <input type="hidden" id="id" value={data.id} />

            <div className="flex flex-row w-4/5 place-content-center gap-10 m-5 ">
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
                <div className="w-full flex flex-row gap-5">
                    <InputLabel htmlFor="fecha" value="Fecha" />
                    <input
                        type="date"
                        id="fecha"
                        name="fecha"
                        className="mt-1 block w-full bg-transparent rounded-lg bg-[#121827]"
                        onChange={(e) => setData("fecha", e.target.value)}
                        value={data.fecha}
                    />
                    <InputError
                        message={errors.observaciones}
                        className="mt-2"
                    />
                </div>
            </div>

            <div className="flex flex-row w-4/5 place-content-center gap-10 ">
                <div className="w-1/2">
                    <InputLabel htmlFor="frecuencia" value="Frecuencia" />
                    <TextInput
                        id="frecuencia"
                        name="frecuencia"
                        value={data.frecuencia}
                        className="mt-1 block w-full"
                        isFocused={true}
                        onChange={(e) => setData("frecuencia", e.target.value)}
                        placeholder="Frecuencia"
                        required
                    />
                    <InputError message={errors.frecuencia} className="mt-2" />
                </div>
                <div className="w-1/2">
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
                    <InputError message={errors.frecuencia} className="mt-2" />
                </div>
            </div>

            <div className="flex flex-row w-4/5 place-content-center gap-10 ">
                <div className="w-full">
                    <InputLabel htmlFor="observaciones" value="Observaciones" />
                    <TextInput
                        id="observaciones"
                        name="observaciones"
                        value={data.observaciones}
                        className="mt-1 block w-full"
                        isFocused={true}
                        onChange={(e) =>
                            setData("observaciones", e.target.value)
                        }
                        placeholder="observaciones"
                        required
                    />
                    <InputError
                        message={errors.observaciones}
                        className="mt-2"
                    />
                </div>
            </div>

            <div className="flex flex-row w-4/5 place-content-center gap-10 ">
                <div className="w-full">
                    <InputLabel htmlFor="tipo" value="Tipo" />
                    <select
                        id="tipo"
                        name="tipo"
                        value={data.tipo}
                        className="mt-1 block w-1/2 rounded-lg bg-[#121827] text-white text-center items-center justify-center cursor-pointer"
                        onChange={(e) => handleSelect(e)}
                        placeholder="tipo"
                        required
                    >
                        <option className="mt-1 block w-full bg-[#121827] cursor-pointer" value="servicio">Servicio</option>
                        <option className="mt-1 block w-full bg-[#121827] cursor-pointer" value="persona">Persona</option>
                        <option className="mt-1 block w-full bg-[#121827] cursor-pointer" value="evento">Evento</option>
                    </select>
                    <InputError message={errors.tipo} className="mt-2" />
                </div>
            </div>

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
