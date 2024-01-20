import { Switch } from "../Switch";

export const CuadroFiltros = ({filtros, handleCheck}) => {
    return (
        <div
            id="cuadroFiltros"
            className="absolute scale-75 left-0 top-0 mt-[-40px] ml-[45px] bg-blue-950 flex-col w-[260px] rounded-lg
            shadow-[5px_5px_10px_rgba(0,0,0,.8),inset_3px_3px_8px_rgba(255,255,255,.5)] items-center justify-between p-2"
        >
            <div className="p-2 w-full flex flex-row items-center justify-between ">
                Comprobados{" "}
                <Switch
                    name="comprobado"
                    handleCheck={() => handleCheck("comprobado")}
                    checked={filtros.comprobado}
                />
            </div>
            <div className="p-2 w-full flex flex-row items-center justify-between ">
                Desconocidos{" "}
                <Switch
                    name="comprobado"
                    handleCheck={() => handleCheck("nocomprobado")}
                    checked={filtros.nocomprobado}
                />
            </div>
            <div className="p-2 w-full flex flex-row items-center justify-between">
                Públicos{" "}
                <Switch
                    name="publico"
                    handleCheck={() => handleCheck("publico")}
                    checked={filtros.publico}
                />
            </div>
            <div className="p-2 w-full flex flex-row items-center justify-between">
                Privados{" "}
                <Switch
                    name="privado"
                    handleCheck={() => handleCheck("privado")}
                    checked={filtros.privado}
                />
            </div>
            <div className="p-2 w-full flex flex-row items-center justify-between">
                Aviación{" "}
                <Switch
                    name="aviacion"
                    handleCheck={() => handleCheck("aviacion")}
                    checked={filtros.aviacion}
                />
            </div>
            <div className="p-2 w-full flex flex-row items-center justify-between">
                Emisoras{" "}
                <Switch
                    name="emisora"
                    handleCheck={() => handleCheck("emisora")}
                    checked={filtros.emisora}
                />
            </div>
            <div className="p-2 w-full flex flex-row items-center justify-between">
                Empresas{" "}
                <Switch
                    name="empresa"
                    handleCheck={() => handleCheck("empresa")}
                    checked={filtros.empresa}
                />
            </div>
            <div className="p-2 w-full flex flex-row items-center justify-between">
                Eventos{" "}
                <Switch
                    name="evento"
                    handleCheck={() => handleCheck("evento")}
                    checked={filtros.evento}
                />
            </div>
            <div className="p-2 w-full flex flex-row items-center justify-between">
                Particulares{" "}
                <Switch
                    name="particular"
                    handleCheck={() => handleCheck("particular")}
                    checked={filtros.particular}
                />
            </div>
            <div className="p-2 w-full flex flex-row items-center justify-between">
                Servicios{" "}
                <Switch
                    name="servicio"
                    handleCheck={() => handleCheck("servicio")}
                    checked={filtros.servicio}
                />
            </div>
        </div>
    );
};
