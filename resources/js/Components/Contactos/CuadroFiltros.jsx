import { Switch } from "../Switch";

export const CuadroFiltros = ({
    filtros,
    handleCheck,
    listaFiltros,
    handlerCheckUncheck,
}) => {
    const classFiltro = "p-2 w-full flex flex-row items-center justify-between";

    return (
        <div
            id="cuadroFiltros"
            className="absolute scale-75 left-0 top-0 mt-[-40px] ml-[45px] bg-blue-950 flex-col w-[260px] rounded-lg
            shadow-[5px_5px_10px_rgba(0,0,0,.8),inset_3px_3px_8px_rgba(255,255,255,.5)] items-center justify-between p-2 max-[1280px]:scale-50 max-[1280px]:mt-[-130px] max-[1280px]:ml-[0px] "
        >
            <div
                id="selectFilters"
                className="w-full flex flex-row items-center justify-between p-2"
            >
                <span
                    className="flex place-content-center rounded-md py-1 m-2 w-full shadow-[2px_2px_5px_rgba(255,255,255,0.5] hover:text-green-500 cursor-pointer "
                    onClick={handlerCheckUncheck}
                >
                    <i className="scale-150 fa-regular fa-square-check"></i>
                </span>
            </div>
            {listaFiltros.map(({ label, key }) => (
                <div className={classFiltro} key={key}>
                    <span className="w-full text-right">{label}</span>
                    <span className="w-full flex items-start">
                        <Switch
                            name={key}
                            handleCheck={() => handleCheck(key)}
                            checked={filtros[key]}
                            className="cursor-pointer"
                        />
                    </span>
                </div>
            ))}
        </div>
    );
};
