export const UserImage = ({ userDB, isAdmin }) => {
    const estilosBase = "w-[50px] h-[50px] rounded-full mr-10";
    const estilosAdmin = "shadow-[0px_0px_10px_rgb(255,255,0)]";

    const styleUserImg = isAdmin
        ? estilosBase + " " + estilosAdmin
        : estilosBase;

    let isPhoto = userDB.photo != "/storage/images/" ? 1 : 0;

    return (
        <a href="/profile">
            {isPhoto ? (
                <img
                    className={styleUserImg}
                    src={userDB.photo}
                    alt="Imagen del usuario"
                />
            ) : (
                    <span className={estilosBase}>{userDB.username} {isAdmin ? '*' :'' }</span>
            )}
        </a>
    );
};
