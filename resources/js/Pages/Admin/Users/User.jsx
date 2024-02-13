export const User = ({ user }) => {
    // console.log(user);
    return (
        <div className="flex flex-row items-center justify-start gap-5 p-4">
            <img
                className={`w-[70px] h-[70px] rounded-full ${
                    user.isAdmin
                        ? "shadow-[0_0_15px_rgba(255,255,0,.8)] border-2 border-yellow-500 "
                        : ""
                }`}
                src={user.photo}
            ></img>
            <span className="w-1/12 text-center font-bold text-xl">
                {user.username}
            </span>
            <span className="w-2/12">
                {user.nombre} {user.apellidos}
            </span>
            <span className="w-1/12 text-center text-xs text-gray-400">
                {user.email}
            </span>
            <span className="w-2/12 flex flex-col items-center justify-around font-thin text-xs text-gray-400">
                <span>{user.localizacion?.localidad}</span>
                <span>{user.localizacion?.provincia}</span>
                <span>{user.localizacion?.gps}</span>
            </span>
            <span className="w-1/12 flex items-center justify-center">
                {!user.isAdmin ? (
                    <i className="fa-solid fa-shield scale-150"></i>
                ) : (
                    <i className="fa-solid fa-shield-halved scale-150"></i>
                )}
            </span>
        </div>
    );
};
