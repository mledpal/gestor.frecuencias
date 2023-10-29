import { CommonMenu, UserMenu } from ".";

export const BurgerMenu = ({ isAdmin }) => {
    return (
        <>
            <i className="fa-solid fa-bars fa-2xl mr-10 cursor-pointer peer"></i>
            <ul
                id="menuOculto"
                className="absolute w-[175px] right-10 top-[65px] rounded-lg p-5 z-10 text-sm bg-colorbg flex-col hidden peer-hover:flex hover:flex drop-shadow-lg "
            >
                <CommonMenu />
                <hr className="my-2" />
                <UserMenu isAdmin={isAdmin} />
            </ul>
        </>
    );
};
