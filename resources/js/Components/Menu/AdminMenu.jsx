export const AdminMenu = () => {
    return (
        <>
            <li className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-sm ">
                <i className="fa-solid fa-address-book"></i>
                Usuarios
            </li>
            <li className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-sm ">
                <i className="fa-solid fa-shield"></i>
                Administración
            </li>
        </>
    );
};
