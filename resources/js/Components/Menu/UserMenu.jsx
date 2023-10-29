export const UserMenu = () => {
    return (
        <>
            <li className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-sm ">
                <i className="fa-sharp fa-solid fa-right-to-bracket"></i>
                Conectar
            </li>
            <li className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-sm ">
                <i className="fa-sharp fa-solid fa-user"></i>
                Mi cuenta
            </li>
            <li className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-sm ">
                <i className="fa-solid fa-address-book"></i>
                Contactos
            </li>
            <li className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-sm ">
                <i className="fa-sharp fa-solid fa-envelope"></i>
                Mensajes
            </li>
            <li className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-sm ">
                <i className="fa-solid fa-gear"></i>
                Configuración
            </li>
            <li className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-sm ">
                <i className="fa-solid fa-shield"></i>
                Administración
            </li>
            <li className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-sm ">
                <i className="fa-solid fa-right-from-bracket"></i>
                Desconectar
            </li>
        </>
    );
};
