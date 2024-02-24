export const DatosUsuario = ({c, handleDeleteConversation, handleUserClicked}) => {
    return (<div
        className="p-2 w-full h-[100px] mx-auto flex flex-row justify-between odd:bg-slate-800 even:bg-slate-700 shadow-[-2px_2px_5px_rgba(0,0,0,.5)] items-center px-5 rounded-lg"
    >
        <div
            onClick={(e) =>
                handleUserClicked(e, c.id)
            }
            className=" text-xs font-light flex flex-row items-center justify-between w-11/12 "
            link="#"
        >
            <div className="w-4/12">
                <img src={c.photo} width={'65px'} height={'75px'} className="rounded-full" />
            </div>
            <div className="flex flex-col w-8/12 h-[100px] py-4 text-left">
                <p className="text-xl font-bold">{c.username}</p>
                <p className="text-lg font-thin">{c.indicativo}</p>
            </div>
            {/* <UserImage userDB={c} link="" /> */}
        </div>
        <span className="w-1/12 text-center"
            onClick={(e) => {
                handleDeleteConversation(e, c.id);
            }}
        >
            <i className="fa-solid fa-trash-can text-red-500 cursor-pointer hover:scale-125 hover:shadow-[0_0_5px_rgba(0,0,0,.1)] ease-in-out duration-150 hover:drop-shadow-[0_0_5px_rgba(255,255,255,.4)]"></i>
        </span>
    </div>)
}
