import { BotonesFormulario } from "@/Components/BotonesFormulario/BotonesFormulario";
import { Switch } from "@/Components/Switch";
import { useFilters } from "@/hooks/useFilters";

export const FiltrosContacto = ({ busqueda, setVista }) => {
    const { filtros, listaFiltros, handleCheck, handlerCheckUncheck } =
        useFilters(busqueda);

    const classFiltro = "p-2 w-full flex flex-row items-center justify-between";

    return (
        <div id="cuadroFiltros" className="w-screen select-none">
            <div className="w-screen p-4 flex justify-end items-center bg-slate-900">
                <BotonesFormulario
                    actionSubmit={handlerCheckUncheck}
                    textSubmit={"Reset"}
                    colorSubmit={"bg-green-600"}
                    iconSubmit="fa-rotate"
                    actionApply={() => {
                        setVista("movil");
                    }}
                />
            </div>
            <div
                id="selectFilters"
                className="flex flex-row items-center justify-between p-2"
            ></div>
            {listaFiltros.map(({ label, key }) => (
                <div className={classFiltro} key={key}>
                    <span className="w-full text-right">{label}</span>
                    <span className="w-full flex items-start">
                        <Switch
                            name={key}
                            handleCheck={(e) => handleCheck(e, key)}
                            checked={filtros[key]}
                            className="cursor-pointer"
                        />
                    </span>
                </div>
            ))}
        </div>
    );
};
