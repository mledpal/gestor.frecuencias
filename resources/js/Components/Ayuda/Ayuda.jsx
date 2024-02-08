import { Button } from "@material-tailwind/react";

export const Ayuda = ({ handleOpenHelp }) => {
    return (
        <div
            className="w-2/3 min-h-full bg-slate-800 shadow-[inset_-2px_2px_10px_rgba(255,255,255,.5),-2px_-2px_10px_rgba(0,0,0,.5)] flex flex-col items-center justify-between  rounded-xl m-auto select-none"
            onClick={() => handleOpenHelp(null)}
        >
            <header className="h-15 w-full flex items-center justify-center bg-gradient-to-tl from-blue-900 bg-slate-800 rounded-tr-xl rounded-tl-xl p-5 font-bold text-xl shadow-[inset_2px_0_5px_rgba(255,255,255,.5),inset_-2px_0_5px_rgba(0,0,0,.5)]">
                Manual de usuario
            </header>
            <main className="p-4 w-full h-full flex flex-row items-center justify-center"></main>
            <footer className="w-full p-5 flex items-center justify-around h-15 bg-gradient-to-br from-blue-900 bg-slate-800 rounded-br-xl rounded-bl-xl font-bold text-xl shadow-[inset_2px_0_5px_rgba(255,255,255,.5),inset_-2px_0_5px_rgba(0,0,0,.5)] ">
                <Button
                    variant="text"
                    color="red"
                    onClick={() => handleOpenHelp(null)}
                    className="border-[1px] px-5 py-2 hover:scale-110 bg-red-700 text-white duration-200 ease-in-out"
                >
                    <span>
                        Salir <i className="fa-solid fa-door-open"></i>
                    </span>
                </Button>
            </footer>
        </div>
    );
};
