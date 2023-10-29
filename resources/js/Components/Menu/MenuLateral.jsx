import { CommonMenu, UserMenu } from "./";

export const MenuLateral = ({ isAdmin }) => {
    return (
        <>
            <aside className="w-[275px] p-[20px] text-xl font-light">
                <ul className="h-full flex flex-col justify-between items-start">
                    <div id="options" className="w-full">
                        <CommonMenu />
                    </div>

                    <div id="user" className="w-full">
                        <UserMenu isAdmin={isAdmin} />
                    </div>
                </ul>
            </aside>
        </>
    );
};
