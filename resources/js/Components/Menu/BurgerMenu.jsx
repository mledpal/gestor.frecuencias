import { useState } from "react";
import { CommonMenu, UserMenu } from ".";
import { AdminMenu } from "./AdminMenu";
import { MenuAyuda } from "./MenuAyuda";

export const BurgerMenu = ({ isAdmin, setVista }) => {
    const [visible, setVisible] = useState(null);

    const faIcon = visible ? "fa-bars style='color: #000000;'" : "fa-bars";

    return (
        <div className="relative select-none">
            <i
                className={`fa-solid ${faIcon} fa-2xl mr-10 cursor-pointer duration-150 ease-linear peer`}
                onMouseEnter={() => setVisible(true)}
                onMouseLeave={() => setVisible(false)}
                onClick={() => setVisible(!visible)}
            ></i>

            {visible && (
                <ul
                    className="mt-1 right-10 absolute w-[200px] rounded-lg p-5 z-50 text-sm bg-blue-800 flex-col drop-shadow-lg hidden hover:flex peer-hover:flex"
                    onMouseEnter={() => setVisible(true)}
                    onMouseLeave={() => setVisible(false)}
                >
                    <CommonMenu setVista={setVista} />
                    <hr className="my-2" />
                    <UserMenu setVista={setVista} />
                    {isAdmin ? (
                        <>
                            <hr className="my-2" />
                            <AdminMenu setVista={setVista} />
                            <hr className="my-2" />
                        </>
                    ) : (
                        <hr className="my-2" />
                    )}

                    <MenuAyuda />
                </ul>
            )}
        </div>
    );
};
