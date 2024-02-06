export const CommonMenu = () => {
    return (
        <>
            <a href={route("index")}>
                <li className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-md ">
                    <i className="fa-solid fa-house" />
                    Inicio
                </li>
            </a>
            {/* <li className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-md ">
                <i className="fa-solid fa-magnifying-glass"></i>
                Buscar
            </li> */}

            <a href="/profile">
                <li className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-sm ">
                    <i className="fa-sharp fa-solid fa-user"></i>
                    Mi cuenta
                </li>
            </a>


        </>
    );
};
