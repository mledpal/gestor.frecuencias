import GuestLayout from "@/Layouts/GuestLayout";
import { Radio } from "@/Components/Radio/Radio";

export default function ({ status, canResetPassword }) {
    return (
        <GuestLayout>
            <Radio
                status={status}
                canResetPassword={canResetPassword}
                form="forgot"
            />
        </GuestLayout>
    );
}
