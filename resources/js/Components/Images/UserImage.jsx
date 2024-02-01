export const UserImage = ({ userDB, link }) => {
    const estilosBase = "w-[40px] h-[40px] rounded-full mr-10";
    const estilosAdmin =
        "border-2 border-yellow-500 shadow-[0px_0px_10px_rgb(255,255,0)]";

    const isAdmin = userDB.roles.some((rol) => rol.id === 1);

    const styleUserImg = isAdmin
        ? estilosBase + " " + estilosAdmin
        : estilosBase;

    let isPhoto = userDB.photo != "/storage/images/" ? 1 : 0;

    const color = isAdmin ? "yellow" : "blue";

    return (
        <a href={link}>
            <div
                className={`bg-gradient-to-b from-${color}-600 to-${color}-900 shadow-[-2px_2px_3px_rgba(0,0,0,.7),inset_-2px_2px_5px_rgba(255,255,255,.5)]  mr-[20px] h-[60px] w-[200px] p-3 flex flex-row items-center justify-around rounded-[50px] hover:scale-105 hover:shadow-[0_0_5px_rgba(0,0,0,.1)] ease-in-out duration-300 max-[1280px]:scale-75 max-[1280px]:hover:scale-90`}
            >
                {isPhoto ? (
                    <img
                        className={styleUserImg}
                        src={userDB.photo}
                        alt="Imagen del usuario"
                    />
                ) : (
                    <span
                        className={`flex items-center justify-center ${styleUserImg}`}
                    >
                        <i className="fa-regular fa-circle-user"></i>
                    </span>
                )}
                <div className="flex flex-col text-colortxt200">
                    <span className="text-center font-bold text-lg">
                        {userDB.username}
                    </span>
                    <span className="text-center text-xs ">
                        {userDB.indicativo ?? userDB.email}
                    </span>
                </div>
            </div>
        </a>
    );
};
