export const Mobile = ({ setVista }) => {
    const clases = `h-full w-1/2 p-2 text-sm bg-gradient-to-br from-indigo-900 to-indigo-700 flex flex-col items-center justify-around shadow-[inset_2px_2px_10px_rgba(0,0,0,.5)] rounded-xl`;
    return (
        <header className="w-full h-[100px] bg-indigo-600 p-2 flex flex-row gap-1 select-none">
            <div className={clases} onClick={() => setVista("crear_contacto")}>
                <i className="fa-solid fa-plus scale-150"></i>
                <span className="text-center text-xs">Crear contacto</span>
            </div>
            <div className={clases} onClick={() => setVista("buscar_contacto")}>
                <i className="fa-solid fa-magnifying-glass scale-150"></i>
                <span className="text-center text-xs">Buscar contacto</span>
            </div>
            <div className={clases} onClick={() => setVista("filtros")}>
                <i className="fa-solid fa-filter scale-150"></i>
                <span className="text-center text-xs">Editar Filtros</span>
            </div>
        </header>
    );
};
