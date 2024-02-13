import { useEffect, useState } from "react";
import { User } from "./User";

export const Users = () => {
    const [usuarios, setUsuarios] = useState(null);

    useEffect(() => {
        fetch(route("admin_usuarios"))
            .then((res) => res.json())
            .then((res) => setUsuarios(res))
            .catch((err) => console.error(err));
    }, []);

    // useEffect(() => {
    //     usuarios && console.log(usuarios);
    // }, [usuarios]);

    return (
        <div className="flex flex-col w-screen h-full items-center justify-stretch">
            <header className="w-full h-[80px] flex  items-center justify-center">
                <h2>Administración de usuarios</h2>
            </header>
            <main className="w-full flex h-5/6 bg-gradient-to-br from-indigo-950 to-indigo-800 items-center justify-center">
                <div className="w-full min-h-full overflow-y-auto">
                    {usuarios ? (
                        usuarios.map((user) => {
                            return (
                                <div
                                    key={user.id}
                                    className="w-full even:bg-gray-600 odd:bg-gray-700"
                                >
                                    <User user={user} />
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
