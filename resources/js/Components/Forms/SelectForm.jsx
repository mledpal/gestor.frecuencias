import { FormForgot } from "./FormForgot";
import { FormLogin } from "./FormLogin";
import { FormRegister } from "./FormRegister";
import { FormReset } from "./FormReset";
import { FormConfirm } from "./FormConfirm";
import { FormVerify } from "./FormVerify";

export const SelectForm = ({ form, status, canResetPassword }) => {
    switch (form) {
        case "register":
            return (
                <FormRegister
                    status={status}
                    canResetPassword={canResetPassword}
                />
            );
        case "login":
            return (
                <FormLogin
                    status={status}
                    canResetPassword={canResetPassword}
                />
            );
        case "forgot":
            return (
                <FormForgot
                    status={status}
                    canResetPassword={canResetPassword}
                />
            );
        case "reset":
            return <FormReset status={status} />;
        case "confirm":
            return <FormConfirm />;
        case "verify":
            return <FormVerify status={status} />;
        default:
            return null;
    }
};
