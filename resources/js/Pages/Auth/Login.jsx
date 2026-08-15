import GuestLayout from "@/Layouts/GuestLayout";

import { Radio } from "@/Components/Radio/Radio";
import { Walkie } from "@/Components/Walkie/Walkie";
import { usePantallaPequena } from "@/hooks/usePantallaPequena";

export default function ({ status, canResetPassword }) {
    const isSmallScreen = usePantallaPequena();

    return (
        <GuestLayout>
            {isSmallScreen ? (
                <Walkie
                    status={status}
                    canResetPassword={canResetPassword}
                    form="login"
                />
            ) : (
                <Radio
                    status={status}
                    canResetPassword={canResetPassword}
                    form="login"
                />
            )}
        </GuestLayout>
    );
}
