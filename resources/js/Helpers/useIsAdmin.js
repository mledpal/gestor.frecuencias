import { useEffect } from "react";

export const useIsAdmin = () => {
    const [isAdmin, setAdmin] = useState(0);

    useEffect(() => {
        const userRolesArray = [];
        roles.forEach((r) => {
            userRolesArray.push(r.nombre);
            r.nombre === "admin" ? setAdmin(1) : "";
        });
        setRoles(userRolesArray);
    }, []);

    return isAdmin, setAdmin;
};
