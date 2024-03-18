/**
 *  Componente que muestra ayuda acerca de los iconos que se utilizan en la lista de contactos
 * @returns {JSX.Element}
 */

export const IconosListaContactos = () => {
    return (
        <div className="w-full items-center justify-normal">
            <article className="w-3/4 m-auto mb-4">
                <header className="text-center bg-gray-900 rounded-tr-lg rounded-tl-lg">
                    <h2 className="font-bold text-xl p-2">Iconos superiores</h2>
                </header>
                <main>
                    <ol className="text-gray-200 bg-gray-700 p-4 rounded-bl-lg rounded-br-lg">
                        <li className="flex flex-row items-center justify-start gap-4 w-full m-auto mb-2">
                            <i className="fa-solid fa-circle-plus scale-150"></i>
                            <p>
                                Abre la ventana de diálogo para crear un nuevo
                                contacto
                            </p>
                        </li>
                        <li className="flex flex-row items-center justify-start gap-4 w-full m-auto mb-2">
                            <i className="fa-solid fa-magnifying-glass scale-150"></i>
                            <p>Abre la ventana de diálogo del buscador</p>
                        </li>
                        <li className="flex flex-row items-center justify-start gap-4 w-full m-auto mb-2">
                            <i className="fa-solid fa-magnifying-glass text-red-500 scale-150"></i>
                            <p>Indica que hay una búsqueda activa</p>
                        </li>
                        <li className="flex flex-row items-center justify-start gap-4 w-full m-auto mb-2">
                            <i className="fa-solid fa-broom scale-150"></i>
                            <p>
                                Recarga los contactos iniciales tras una
                                búsqueda
                            </p>
                        </li>
                        <li className="flex flex-row items-center justify-start gap-4 w-full m-auto mb-2">
                            <i className="fa-solid fa-filter scale-150"></i>
                            <p>Abre el cuadro de diálogo de los filtros</p>
                        </li>
                    </ol>
                </main>
            </article>

            <article className="w-3/4 m-auto">
                <header className="text-center bg-gray-900 rounded-tr-lg rounded-tl-lg">
                    <h2 className="font-bold text-xl p-2">
                        Iconos en los contactos
                    </h2>
                </header>
                <main>
                    <ol className="text-gray-200 bg-gray-700 p-4 rounded-bl-lg rounded-br-lg">
                        <li className="flex flex-row items-center justify-start gap-4 w-full m-auto mb-2">
                            <i className="h-[10px] w-[10px] rounded-full border-[1px] border-yellow-500 bg-yellow-500 shadow-[yellow] drop-shadow-circle"></i>
                            <p>Contacto Comprobado</p>
                        </li>

                        <li className="flex flex-row items-center justify-start gap-4 w-full m-auto mb-2">
                            <i className="h-[10px] w-[10px] rounded-full border-[1px] border-yellow-500"></i>
                            <p>Contacto No Comprobado</p>
                        </li>

                        <li className="flex flex-row items-center justify-start gap-4 w-full m-auto mb-2">
                            <i className="fa-solid fa-tower-cell scale-150"></i>
                            <p>
                                Indica que el contacto tiene configurado un
                                repetidor
                            </p>
                        </li>
                        <li className="flex flex-row items-center justify-start gap-4 w-full m-auto mb-2">
                            <i className="fa-solid fa-location-dot scale-150"></i>
                            <p>
                                Coordenadas GPS configuradas. Se puede abrir un
                                mapa
                            </p>
                        </li>

                        <li className="flex flex-row items-center justify-start gap-4 w-full m-auto mb-2">
                            <i className="fa-solid fa-lock scale-150"></i>
                            <p>Contacto privado. No se comparte</p>
                        </li>

                        <li className="flex flex-row items-center justify-start gap-4 w-full m-auto mb-2">
                            <i className="text-red-500 fa-solid fa-heart"></i>
                            <p>Contacto favorito</p>
                        </li>

                        <li className="flex flex-row items-center justify-start gap-4 w-full m-auto mb-2">
                            <div className="w-[40px] h-[25px] flex bg-black text-white rounded-tr-[5px] rounded-bl-[5px] font-bold text-[10px] items-center justify-center text-center border-[1px] border-white">
                                WFM
                            </div>
                            <p>Modo de transmisión</p>
                        </li>
                    </ol>
                </main>
            </article>
        </div>
    );
};
