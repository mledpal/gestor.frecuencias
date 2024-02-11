import GuestLayout from "@/Layouts/GuestLayout";
import { useMediaQuery } from "@react-hook/media-query";
import { Radio } from "@/Components/Radio/Radio";
import { Walkie } from "@/Components/Walkie/Walkie";

export default function ({ status, canResetPassword }) {
    const isSmallScreen = useMediaQuery("(max-width: 900px)");

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
