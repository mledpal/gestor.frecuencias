export const CommonMenu = () => {
    return (
        <>
            <li className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-md ">
                <i className="fa-solid fa-house" />
                Inicio
            </li>
            <li className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-md ">
                <i className="fa-solid fa-magnifying-glass"></i>
                Buscar
            </li>

            <li className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-md ">
                <i className="fa-solid fa-walkie-talkie"></i>
                Frecuencias
            </li>
        </>
    );
};
