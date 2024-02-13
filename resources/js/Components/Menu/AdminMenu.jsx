export const AdminMenu = ({ setVista }) => {
    return (
        <>
            <li
                className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-sm "
                onClick={() => setVista("admin_users")}
            >
                <i className="fa-solid fa-address-book text-orange-300"></i>
                Usuarios
            </li>

            <li className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-sm ">
                <i className="fa-solid fa-shield text-orange-300"></i>
                Administración
            </li>
        </>
    );
};
