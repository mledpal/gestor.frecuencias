import GuestLayout from "@/Layouts/GuestLayout";
import { Radio } from "@/Components/Radio/Radio";

import { Walkie } from "@/Components/Walkie/Walkie";
import { useContext } from "react";
import { AppContext } from "@/Components/AppProvider";

export default function ({ status, canResetPassword }) {
    const { isSmallScreen } = useContext(AppContext);
    return (
        <GuestLayout>
            {isSmallScreen ? (
                <Walkie
                    status={status}
                    canResetPassword={canResetPassword}
                    form="forgot"
                />
            ) : (
                <Radio
                    status={status}
                    canResetPassword={canResetPassword}
                    form="forgot"
                />
            )}
        </GuestLayout>
    );
}
