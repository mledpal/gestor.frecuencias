import { AppContext } from "@/Components/AppProvider";
import { useContext } from "react";

export const DatosUsuario = ({
    c,
    handleDeleteConversation,
    handleUserClicked,
}) => {
    const { isSmallScreen } = useContext(AppContext);

    const estilosBase = "w-[50px] h-[50px] rounded-full mr-10";
    const estilosAdmin =
        "border-2 border-yellow-500 shadow-[0px_0px_10px_rgb(255,255,0)]";

    const isAdmin = c.roles.some((rol) => rol.id === 1);

    const styleUserImg = isAdmin
        ? estilosBase + " " + estilosAdmin
        : estilosBase;

    let isPhoto = c.photo != "/storage/images/" ? 1 : 0;

    const color = isAdmin ? "yellow" : "blue";

    return (
        <div
            className={`p-2 w-full h-[80px] mx-auto flex flex-row justify-between bg-gradient-to-b from-${color}-600 to-${color}-900 odd:bg-slate-800 even:bg-slate-700 shadow-[-2px_2px_5px_rgba(0,0,0,.5)] items-center px-5 ${
                isSmallScreen ? "my-0" : "my-2"
            } cursor-pointer hover:scale-95 duration-200`}
        >
            <div
                onClick={(e) => handleUserClicked(e, c.id)}
                className=" text-xs font-light flex flex-row items-center justify-between w-11/12 "
                link="#"
            >
                <div className="w-2/12">
                    <img src={c.photo} className={styleUserImg} />
                </div>
                <div className="flex flex-col w-10/12 h-[100px] py-4 text-left">
                    <p className="text-lg font-bold">{c.username}</p>
                    <p
                        className={`text-sm ${
                            isAdmin ? "text-gray-300" : "text-yellow-300"
                        }  italic font-thin`}
                    >
                        {c.indicativo}
                    </p>
                    <span className="text-[.8rem] text-gray-400">
                        {c.last_message}
                    </span>
                </div>
                {/* <UserImage userDB={c} link="" /> */}
            </div>
            <div className="w-1/12 text-center flex flex-col items-center justify-between">
                <span className="text-xs">{c.last_message_timestamp}</span>
                <span
                    onClick={(e) => {
                        handleDeleteConversation(e, c.id);
                    }}
                >
                    <i
                        className={`fa-solid fa-trash-can ${
                            isAdmin ? "text-red-800" : "text-red-500"
                        }  cursor-pointer hover:scale-125 hover:shadow-[0_0_5px_rgba(0,0,0,.1)] ease-in-out duration-150 hover:drop-shadow-[0_0_5px_rgba(255,255,255,.4)]`}
                    ></i>
                </span>
            </div>
        </div>
    );
};
