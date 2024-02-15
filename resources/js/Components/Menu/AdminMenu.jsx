export const AdminMenu = ({ setVista, setVisible }) => {
    return (
        <>
            <li
                className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-sm "
                onClick={() => {
                    setVisible(null);
                    setVista("admin_users");
                }}
            >
                <i className="fa-solid fa-address-book text-orange-300"></i>
                Usuarios
            </li>

            <li
                className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-sm "
                onClick={() => {
                    setVisible(null);
                    setVista("admin_tipo_codificacion");
                }}
            >
                <i className="fa-solid fa-barcode text-orange-300"></i>
                Tipos de Codificación
            </li>

            <li
                className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-sm "
                onClick={() => {
                    setVisible(null);
                    setVista("admin_tipo_contacto");
                }}
            >
                <i className="fa-solid fa-flag text-orange-300"></i>
                Tipos de Contacto
            </li>
        </>
    );
};
