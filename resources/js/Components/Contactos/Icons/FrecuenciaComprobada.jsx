export const FrecuenciaComprobada = ({comprobada}) => {
    let clases = "h-[10px] w-[10px] rounded-full border-[1px] border-yellow-500 ";
    clases = (comprobada) ? clases+ " bg-yellow-500 shadow-[yellow] drop-shadow-circle " : clases;
    return <div name="comprobada" className={clases}></div>
}
