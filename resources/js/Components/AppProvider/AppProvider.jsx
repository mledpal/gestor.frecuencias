import { AppContext } from "./AppContext";

export const AppProvider = ({ children }) => {
    return (
        <AppContext.Provider value={{ hola: "mundo" }}>
            {children}
        </AppContext.Provider>
    );
};
