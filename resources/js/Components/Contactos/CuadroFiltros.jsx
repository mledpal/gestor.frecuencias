import { Switch } from "../Switch";

export const CuadroFiltros = ({filtros, handleCheck}) => {
    return (
        <div
            id="cuadroFiltros"
            className="absolute left-0 bg-blue-950 flex-col w-[260px] rounded-lg shadow-[5px_5px_10px_rgba(255,255,255,.2)] items-center justify-between p-2 z-100 "
        >
            <div className="p-2 w-full flex flex-row items-center justify-between ">
                Comprobada <Switch name="comprobado" handleCheck={() => handleCheck('comprobado')} checked={filtros.comprobado} />
            </div>
            <div className="p-2 w-full flex flex-row items-center justify-between">
                Privados <Switch name="privado" handleCheck={() => handleCheck('privado')} checked={filtros.privado}/>
            </div>
            <div className="p-2 w-full flex flex-row items-center justify-between">
                Aviación <Switch name="aviacion" handleCheck={() => handleCheck('aviacion')} checked={filtros.aviacion}/>
            </div>
            <div className="p-2 w-full flex flex-row items-center justify-between">
                Emisoras <Switch name="emisora" handleCheck={() => handleCheck('emisora')}  checked={filtros.emisora} />
            </div>
            <div className="p-2 w-full flex flex-row items-center justify-between">
                Empresas <Switch name="empresa" handleCheck={() => handleCheck('empresa')}  checked={filtros.empresa} />
            </div>
            <div className="p-2 w-full flex flex-row items-center justify-between">
                Eventos <Switch name="evento" handleCheck={() => handleCheck('evento')} checked={filtros.evento}/>
            </div>
            <div className="p-2 w-full flex flex-row items-center justify-between">
                Particulares <Switch  name="particular" handleCheck={() => handleCheck('particular')} checked={filtros.particular}/>
            </div>
            <div className="p-2 w-full flex flex-row items-center justify-between">
                Servicios <Switch name="servicio" handleCheck={() => handleCheck('servicio')} checked={filtros.servicio}/>
            </div>
        </div>
    );
};
