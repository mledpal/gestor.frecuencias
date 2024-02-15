import { useAdminUsuarios } from "@/hooks/useAdminUsuarios";
import { User } from "./User";

export const Users = ({ isSmallScreen, userDB }) => {
    
    const { usuarios, deleteUser, swapAdmin } = useAdminUsuarios();

    return (
        <div className="flex flex-col w-screen items-center justify-stretch">
            <header
                className={`h-[75px] sticky top-0 z-20 w-full flex  items-center justify-center bg-gradient-to-br from-indigo-900 to-indigo-700`}
            >
                <h2>Administración de usuarios</h2>
            </header>
            <main className="w-full flex bg-gradient-to-br from-indigo-950 to-indigo-800 items-center justify-center">
                <div className="w-full min-h-full overflow-y-auto">
                    {usuarios ? (
                        usuarios.map((user) => {
                            if (user.id !== userDB.id && !user.isRoot)
                                return (
                                    <div
                                        key={user.id}
                                        className="w-full even:bg-gray-600 odd:bg-gray-700 h-full"
                                    >
                                        <User
                                            user={user}
                                            isSmallScreen={isSmallScreen}
                                            deleteUser={deleteUser}
                                            swapAdmin={swapAdmin}
                                        />
                                    </div>
                                );
                        })
                    ) : (
                        <h3>Cargando</h3>
                    )}
                </div>
            </main>
        </div>
    );
};
