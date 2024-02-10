export const NoContactos = ({
    handleOpenBuscador,
    handleOpen,
    handleOpenUserSearcher,
}) => {
    const cssButtons =
        "w-4/5 h-2/3 border-2 border-transparent bg-gradient-to-br from-gray-800 to-gray-900 shadow-[inset_2px_-2px_5px_black,inset_-2px_2px_5px_rgba(255,255,255,.7)] rounded-xl hover:scale-110 hover:shadow-[0_0_5px_rgba(0,0,0,.5),inset_0_0_5px_rgba(255,255,255,.5)] hover:border-2 hover:border-gray-400 duration-150 ease-linear cursor-pointer select-none flex flex-col items-center justify-center peer ";

    const cssIcons =
        "fa-xl p-2 my-4 peer:hover:drop-shadow-[0_0_10px_rgba(255,255,255,1)] duration-300 z-10 rounded-full";

    return (
        <>
            <div className="flex flex-col items-center justify-between gap-2 w-full h-full">
                <header
                    name="mensajes"
                    className="w-full flex flex-row items-center justify-center p-6 h-[75px] bg-slate-900"
                >
                    <h2 className="font-bold max-w-screen-desktop:text-xl text-lg">
                        Gestión de Frecuencias
                    </h2>
                </header>

                <main className="h-full w-full grid grid-cols-2 place-items-center gap-0">
                    <div
                        className={cssButtons}
                        onClick={() => handleOpen("lg")}
                    >
                        <i
                            className={`fa-solid fa-circle-plus ${cssIcons}`}
                        ></i>
                        <span>Añadir Contacto</span>
                    </div>
                    <div
                        className={cssButtons}
                        onClick={() => handleOpenBuscador("xxl")}
                    >
                        <i
                            className={`fa-solid fa-magnifying-glass ${cssIcons}`}
                        ></i>
                        <span>Buscar Contacto</span>
                    </div>
                    <div
                        className={cssButtons}
                        onClick={() => {
                            handleOpenUserSearcher("xxl");
                        }}
                    >
                        <i className={`fa-solid fa-users ${cssIcons}`}></i>
                        <span>Buscar Usuario</span>
                    </div>
                    <div className={cssButtons}>
                        <i
                            className={`fa-solid fa-address-book ${cssIcons}`}
                        ></i>
                        <span>Lista de Amigos</span>
                    </div>
                    <div className={cssButtons}>
                        <i
                            className={`fa-solid fa-file-import  ${cssIcons}`}
                        ></i>
                        <span>Importar Contactos</span>
                    </div>
                    <div className={cssButtons}>
                        <i
                            className={`fa-solid fa-file-export ${cssIcons}`}
                        ></i>
                        <span>Exportar Contactos</span>
                    </div>
                </main>
            </div>
        </>
    );
};
