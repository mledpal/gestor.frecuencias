export const UserMenu = ({ isAdmin }) => {
    return (
        <>
            <li className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-md ">
                <i className="fa-solid fa-walkie-talkie"></i>
                Contactos
            </li>

            <li className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-sm ">
                <i className="fa-sharp fa-solid fa-envelope"></i>
                Mensajes
            </li>

            {isAdmin ? (
                <li className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-sm ">
                    <i className="fa-solid fa-address-book"></i>
                    Usuarios
                </li>
            ) : (
                ""
            )}

            {isAdmin ? (
                <li className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-sm ">
                    <i className="fa-solid fa-shield"></i>
                    Administración
                </li>
            ) : (
                ""
            )}
        </>
    );
};
