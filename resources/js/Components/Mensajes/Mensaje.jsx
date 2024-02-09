export const Mensaje = ({ datos }) => {
    let fecha = new Date(datos.created_at).toLocaleString("es-ES", {
        timeZone: "Europe/Madrid", // Zona horaria de España
        dateStyle: "short", // Formato completo de la fecha
        timeStyle: "short", // Formato largo de la hora
    });

    return (
        <div className="w-full min-h-[75px] p-2 rounded-lg flex flex-row items-center justify-between">
            <div className="flex flex-col items-center justify-center w-1/5">
                <img
                    className="m-1 w-[50px] h-[50px] rounded-full"
                    src={datos.remitente.photo}
                />
                <span className="text-[.7rem] p-1 text-gray-400">
                    {datos.remitente.username}
                </span>
            </div>
            <div className="flex flex-row items-start justify-start py-2 min-h-[75px] w-3/5 ">
                <span className="h-3/4 flex items-center text-sm max-w-[60ch] px-4 text-left">
                    {datos.mensaje}
                </span>
            </div>

            <div className="w-1/5 flex flex-col items-center justify-end h-full">
                <span className="h-1/4 py-2 text-xs text-gray-500">
                    {fecha}
                </span>
            </div>
        </div>
    );
};
