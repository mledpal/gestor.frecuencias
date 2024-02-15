export const User = ({ user, isSmallScreen, deleteUser, swapAdmin }) => {
    return (
        <div className="relative flex flex-row items-center justify-start gap-5 p-4 h-full select-none">
            <img
                className={`${
                    isSmallScreen ? "w-[40px] h-[40px]" : "w-[70px] h-[70px]"
                } absolute top-1 left-1 rounded-full ${
                    user.isAdmin
                        ? "shadow-[0_0_15px_rgba(255,255,0,.8)] border-2 border-yellow-500 "
                        : ""
                }`}
                src={user.photo}
            ></img>
            <div className={`w-5/12 flex flex-col items-center justify-normal`}>
                <span className="text-center font-bold text-xl ">
                    {user.username}
                </span>
                <div
                    className={`flex-col w-full flex items-center justify-around`}
                >
                    <span
                        className={`${
                            isSmallScreen ? "text-xs" : "text-lg"
                        } text-center text-gray-400`}
                    >
                        {user.nombre} {user.apellidos}
                    </span>
                    <span className="text-center text-xs text-gray-400">
                        {user.email}
                    </span>
                </div>
            </div>
            {isSmallScreen ? (
                ""
            ) : (
                <span className="w-2/12 flex flex-col items-center justify-around font-thin text-xs text-gray-400">
                    <span>{user.localizacion?.localidad}</span>
                    <span>{user.localizacion?.provincia}</span>
                    <span>{user.localizacion?.gps}</span>
                </span>
            )}

            <span
                className={`${
                    isSmallScreen ? "w-3/12" : "w-2/12"
                } flex flex-col items-center justify-around font-thin text-xs text-gray-400`}
            >
                <span>{user.ip}</span>
                <span>{user.ultima_conexion}</span>
            </span>
            <span className="w-2/12 h-16 flex flex-col items-center justify-between">
                {!user.isAdmin ? (
                    <div
                        className="flex flex-row gap-1 hover:scale-150 duration-200 cursor-pointer rounded-full bg-black p-2 text-green-500"
                        onClick={() => swapAdmin(user.id)}
                    >
                        <i className="fa-solid fa-shield"></i>
                        <i className="fa-solid fa-arrow-up "></i>
                    </div>
                ) : (
                    <div
                        className="flex flex-row gap-1 hover:scale-150 duration-200 cursor-pointer rounded-full bg-black p-2 text-red-500"
                        onClick={() => swapAdmin(user.id)}
                    >
                        <i className="fa-solid fa-shield-halved"></i>
                        <i className="fa-solid fa-arrow-down "></i>
                    </div>
                )}
                <i
                    className="fa-solid fa-trash-can text-red-500 hover:scale-150 duration-200 cursor-pointer "
                    onClick={() => deleteUser(user.id)}
                ></i>
            </span>
        </div>
    );
};
