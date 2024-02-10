import { useState } from "react";

export const useBuscarUsuario = () => {
    const [userID, setUserID] = useState(null);

    const [sizeUserSearchModal, setSizeUserSearchModal] = useState(null);
    const handleOpenUserSearcher = (value) => setSizeUserSearchModal(value);

    const [sizeUserMsg, setSizeMsg] = useState(null);
    const handleOpenSendMessage = (value) => setSizeMsg(value);

    return {
        userID,
        setUserID,
        sizeUserSearchModal,
        sizeUserMsg,
        handleOpenUserSearcher,
        handleOpenSendMessage,
    };
};
