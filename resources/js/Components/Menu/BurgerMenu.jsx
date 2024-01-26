import { CommonMenu, UserMenu } from ".";

export const BurgerMenu = ({ isAdmin }) => {
    return (
        <>
            <i className="fa-solid fa-bars fa-2xl mr-10 cursor-pointer peer max-[1280px]:scale-75"></i>
            <ul
                id="menuOculto"
                className="absolute w-[175px] right-10 top-[65px] rounded-lg p-5 z-10 text-sm bg-blue-800 flex-col hidden peer-hover:flex hover:flex drop-shadow-lg max-[1280px]:scale-95 max-[1280px]:top-[5px] max-[1280px]:right-1"
            >
                <CommonMenu />
                <hr className="my-2" />
                <UserMenu isAdmin={isAdmin} />
            </ul>
        </>
    );
};
