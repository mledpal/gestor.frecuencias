export const NoContactos = ({
    handleOpenBuscador,
    handleOpen,
    handleOpenUserSearcher,
    verSeleccion,
}) => {
    const cssButtons =
        "w-full max-w-[200px] h-[110px] p-2 border-2 border-transparent bg-gradient-to-br from-gray-800 to-gray-900 shadow-[inset_2px_-2px_5px_black,inset_-2px_2px_5px_rgba(255,255,255,.7)] rounded-xl hover:scale-105 hover:shadow-[0_0_5px_rgba(0,0,0,.5),inset_0_0_5px_rgba(255,255,255,.5)] hover:border-2 hover:border-gray-400 duration-150 ease-linear cursor-pointer select-none flex flex-col items-center justify-center peer text-center text-xs desktop:text-sm ";

    const cssIcons =
        "fa-lg desktop:fa-xl p-1 my-1 peer:hover:drop-shadow-[0_0_10px_rgba(255,255,255,1)] duration-300 z-10 rounded-full";

    return (
        <>
            <div className="flex flex-col items-center justify-between gap-2 w-full h-full">
                <header
                    name="mensajes"
                    className="w-full flex flex-row items-center justify-center p-6 h-[75px] bg-slate-900"
                >
                    <h2 className="font-bold text-lg desktop:text-xl">
                        Gestión de Frecuencias
                    </h2>
                </header>

                <main className="h-full w-full grid grid-cols-2 desktop:grid-cols-3 place-items-center gap-3 p-4">
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
                    {/* <div className={cssButtons}>
                        <i
                            className={`fa-solid fa-address-book text-gray-700 ${cssIcons}`}
                        ></i>
                        <span className="text-gray-700">Lista de Amigos</span>
                    </div>
                    <div className={cssButtons}>
                        <i
                            className={`fa-solid fa-file-import text-gray-700 ${cssIcons}`}
                        ></i>
                        <span className="text-gray-700">
                            Importar Contactos
                        </span>
                    </div>
                    <div className={cssButtons}>
                        <i
                            className={`fa-solid fa-file-export  text-gray-700 ${cssIcons}`}
                        ></i>
                        <span className="text-gray-700">
                            Exportar Contactos
                        </span>
                    </div> */}
                    <div
                        className={cssButtons}
                        onClick={() => verSeleccion("favorito")}
                    >
                        <i className={`fa-solid fa-heart ${cssIcons}`}></i>
                        <span>Ver Favoritos</span>
                    </div>
                    <div
                        className={cssButtons}
                        onClick={() => verSeleccion("privado")}
                    >
                        <i className={`fa-solid fa-lock ${cssIcons}`}></i>
                        <span>Ver Privados</span>
                    </div>
                    <div
                        className={cssButtons}
                        onClick={() => verSeleccion("todos")}
                    >
                        <i className={`fa-solid fa-asterisk ${cssIcons}`}></i>
                        <span>Ver Todos</span>
                    </div>
                </main>
            </div>
        </>
    );
};
