export const Mobile = ({ setVista }) => {
    return (
        <header className="w-full h-1/6 bg-indigo-500 flex flex-row gap-0 select-none">
            <div
                className="h-full w-1/2 flex flex-col items-center justify-around shadow-[inset_0px_0px_10px_rgba(0,0,0,.5)]"
                onClick={() => setVista("crear_contacto")}
            >
                <i className="fa-solid fa-plus scale-150"></i>
                <span>Crear contacto</span>
            </div>
            <div
                className="h-full w-1/2 flex flex-col items-center justify-around shadow-[inset_0px_0px_10px_rgba(0,0,0,.5)]"
                onClick={() => setVista("buscar_contacto")}
            >
                <i className="fa-solid fa-magnifying-glass scale-150"></i>
                <span>Buscar contacto</span>
            </div>
        </header>
    );
};
