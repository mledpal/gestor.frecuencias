import InputError from "../InputError";
import TextInput from "../TextInput";
import { Comentario } from "./Comentario";
import { useComentarios } from "./Helpers/useComentarios";

export const Comentarios = ({ datos, isAdmin }) => {
    const clasesBotonesFormulario =
        "cursor-pointer hover:scale-150 duration-150 hover:ease-in ease-linear select-none";
    const {
        submit,
        updateComentarios,
        comentarios,
        setData,
        data,
        errors,
        reset,
        editar,
        setEditar,
        deleteComentario,
    } = useComentarios({
        datos,
    });

    return (
        <div className="flex flex-col items-center justify-between gap-2 w-full h-full">
            <form
                name="comentarios"
                method="POST"
                onSubmit={submit}
                encType="multipart/form-data"
                className="sticky top-0  z-2 w-full flex flex-col items-center justify-center mt-0 gap-2"
            >
                <input
                    type="hidden"
                    name="localizacion_id"
                    value={datos.localizacion_id ?? ""}
                ></input>
                <input
                    type="hidden"
                    name="frecuencia_id"
                    value={datos.frecuencia_id ?? ""}
                ></input>

                <header
                    name="comentarios"
                    className="w-full flex flex-row items-center justify-between p-4 h-[75px] bg-slate-900"
                >
                    <div
                        name="botones_comentarios"
                        className="w-1/5 flex flex-row items-center justify-around"
                    >
                        {editar ? (
                            <i
                                onClick={submit}
                                className={`fa-solid fa-pen-to-square text-green-500 ${clasesBotonesFormulario} `}
                            ></i>
                        ) : (
                            <i
                                onClick={submit}
                                className={`fa-solid fa-paper-plane text-white ${clasesBotonesFormulario} `}
                            ></i>
                        )}

                        <i
                            className={`fa-solid fa-trash text-red-500 ${clasesBotonesFormulario}`}
                            onClick={() => {
                                reset();
                                setEditar(null);
                            }}
                        ></i>
                        {/* <i
                        className={`fa-solid fa-person-walking-arrow-right text-white `}
                    ></i> */}
                    </div>
                    <div className="w-3/5 flex flex-col items-center justify-center text-center">
                        <h2 className="font-bold max-w-screen-desktop:text-xl text-lg">
                            Comentarios
                        </h2>
                    </div>
                    <div name="numero_comentarios" className="w-1/5"></div>
                </header>

                <div className="w-full rounded-xl">
                    <TextInput
                        id="comentario"
                        name="comentario"
                        value={data.comentario ?? ""}
                        className="p-2 block w-full text-center text-sm text-white"
                        onChange={(e) => setData("comentario", e.target.value)}
                        placeholder="Escriba un comentario"
                        autoComplete="off"
                        required
                    />
                    <InputError message={errors.comentario} className="mt-2" />
                </div>
            </form>

            <div
                name="lista_comentarios"
                className="w-full h-full p-4 overflow-y-auto select-none"
            >
                {comentarios
                    ? comentarios.map((c) => {
                          return (
                              <div
                                  className="text-xs font-light odd:bg-slate-800 even:bg-slate-700"
                                  key={c.id}
                              >
                                  <Comentario
                                      c={c}
                                      isAdmin={isAdmin}
                                      setData={setData}
                                      setEditar={setEditar}
                                      deleteComentario={deleteComentario}
                                  />
                              </div>
                          );
                      })
                    : "No hay comentarios"}
            </div>
        </div>
    );
};
