export const User = ({ user, isSmallScreen, deleteUser, swapAdmin, onShowMap }) => {
    return (
        <div
            className={`relative flex flex-col items-center justify-between gap-3 p-4 pt-12 h-full select-none rounded-xl bg-gray-700/40 shadow-lg ${
                user.isAdmin
                    ? "border-2 border-yellow-500 shadow-[0_0_15px_rgba(255,255,0,.5)]"
                    : "border border-gray-600/60"
            }`}
        >
            <img
                className={`absolute -top-6 w-[70px] h-[70px] rounded-full object-cover ${
                    user.isAdmin
                        ? "shadow-[0_0_15px_rgba(255,255,0,.8)] border-2 border-yellow-500"
                        : "border-2 border-gray-500"
                }`}
                src={user.photo}
            ></img>

            <div className="flex flex-col items-center justify-normal w-full">
                <span className="text-center font-bold text-xl">
                    {user.username}
                </span>
                <span
                    className={`${
                        isSmallScreen ? "text-xs" : "text-base"
                    } text-center text-gray-400`}
                >
                    {user.nombre} {user.apellidos}
                </span>
                <span className="text-center text-xs text-gray-400 break-all">
                    {user.email}
                </span>
            </div>

            <div className="w-full flex flex-col gap-2 text-center font-thin text-xs text-gray-400">
                <div className="flex flex-col items-center justify-around">
                    <span>{user.localizacion?.localidad}</span>
                    <span>{user.localizacion?.provincia}</span>
                    <span>{user.localizacion?.gps}</span>
                </div>
                <div className="flex flex-col items-center justify-around">
                    <span>{user.ip}</span>
                    <span>{user.ultima_conexion}</span>
                </div>
            </div>

            <div className="w-full flex flex-row items-center justify-center gap-6 pt-2">
                {!user.isAdmin ? (
                    <div
                        className="flex flex-row gap-1 hover:scale-150 duration-200 cursor-pointer rounded-full p-2 text-green-500"
                        onClick={() => swapAdmin(user.id)}
                        title="Promover a administrador"
                    >
                        <i className="fa-solid fa-shield"></i>
                        <i className="fa-solid fa-arrow-up"></i>
                    </div>
                ) : (
                    <div
                        className="flex flex-row gap-1 hover:scale-150 duration-200 cursor-pointer rounded-full bg-black p-2 text-red-500"
                        onClick={() => swapAdmin(user.id)}
                        title="Quitar administrador"
                    >
                        <i className="fa-solid fa-shield-halved"></i>
                        <i className="fa-solid fa-arrow-down"></i>
                    </div>
                )}
                {user.frecuencias_localizadas_count > 0 && (
                    <i
                        className="fa-solid fa-map-location-dot text-blue-400 hover:scale-150 duration-200 cursor-pointer"
                        onClick={() => onShowMap(user)}
                        title="Ver frecuencias en el mapa"
                    ></i>
                )}
                <i
                    className="fa-solid fa-trash-can text-red-500 hover:scale-150 duration-200 cursor-pointer"
                    onClick={() => deleteUser(user.id)}
                    title="Eliminar usuario"
                ></i>
            </div>
        </div>
    );
};
