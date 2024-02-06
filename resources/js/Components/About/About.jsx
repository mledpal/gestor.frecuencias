export const About = ({ handleOpenAbout }) => {
    return (
        <div
            className="w-[800px] h-2/5 bg-slate-800 shadow-[inset_-2px_2px_10px_rgba(255,255,255,.5),-2px_-2px_10px_rgba(0,0,0,.5)] flex flex-col items-center justify-between  rounded-xl m-auto select-none"
            onClick={() => handleOpenAbout(null)}
        >
            <header className="h-15 w-full flex items-center justify-center bg-gradient-to-tl from-blue-900 bg-slate-800 rounded-tr-xl rounded-tl-xl p-5 font-bold text-xl shadow-[inset_2px_0_5px_rgba(255,255,255,.5),inset_-2px_0_5px_rgba(0,0,0,.5)]">
                Acerca de
            </header>
            <main className="p-4 w-full h-full flex flex-row items-center justify-center">
                <div className="w-1/3 p-5 ">
                    <img
                        src="img/miguel.webp"
                        className="h-[200px] w-[200px] rounded-full"
                    />
                </div>
                <article className="w-2/3 h-2/3 flex flex-col items-center justify-around font-sans">
                    <p className=" text-xl font-bold">
                        Miguel Ledesma Palacios
                    </p>
                    <p className="text-gray-400 text-lg font-thin italic">
                        Gestión de frecuencias de radioaficionados
                    </p>
                    <p className="text-lg font-thin">Proyecto para DAW-D</p>
                    <p className="">I.E.S. Trassierra (Córdoba)</p>
                </article>
            </main>
        </div>
    );
};
