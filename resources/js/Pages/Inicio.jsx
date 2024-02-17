import { AppProvider } from "@/Components/AppProvider";
import { AppMain } from "./Vistas/AppMain";

export default function Inicio({ userDB, title, selects, busqueda }) {
    return (
        <AppProvider>
            <AppMain
                title={title}
                userDB={userDB}
                selects={selects}
                busqueda={busqueda}
            />
        </AppProvider>
    );
}
