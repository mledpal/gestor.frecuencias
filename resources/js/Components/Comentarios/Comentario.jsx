import { handleComentarios } from "./Helpers/handleComentarios";

export const Comentario = ({ c, isAdmin, updateComentarios }) => {
    const { deleteComentario } = handleComentarios(updateComentarios);
    console.log(updateComentarios);

    let fecha = new Date(c.created_at).toLocaleString("es-ES", {
        timeZone: "Europe/Madrid", // Zona horaria de España
        dateStyle: "full", // Formato completo de la fecha
        timeStyle: "short", // Formato largo de la hora
    });

    return (
        <div className="w-full min-h-[75px] p-2 rounded-lg flex flex-row items-center justify-between">
            <div className="flex flex-col items-center justify-center">
                <img
                    className="m-1 w-[50px] h-[50px] rounded-full"
                    src={c.user.photo}
                />
                <span className="text-[.7rem] p-1 text-gray-400">
                    {c.user.username}
                </span>
            </div>
            <div className="flex flex-col items-center justify-between pb-2 min-h-[75px] w-4/5 ">
                <span className="h-1/4 py-2 text-gray-500">{fecha}</span>
                <span className="h-3/4 flex flex-start text-sm max-w-[60ch] px-4">
                    {c.comentario}
                </span>
            </div>
            {isAdmin ? (
                <div className="flex flex-col min-h-[75px] items-center justify-between p-1">
                    <i className="fa-solid fa-pen hover:scale-150 duration-150 cursor-pointer"></i>
                    <i
                        className="fa-solid fa-trash text-red-500 hover:scale-150 duration-150 cursor-pointer"
                        onClick={() => deleteComentario(c.id)}
                    ></i>
                </div>
            ) : (
                ""
            )}
        </div>
    );
};
