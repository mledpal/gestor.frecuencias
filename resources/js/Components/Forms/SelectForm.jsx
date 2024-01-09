import { FormForgot } from "./FormForgot";
import { FormLogin } from "./FormLogin";
import { FormRegister } from "./FormRegister";
import { FormReset } from "./FormReset";

export const  SelectForm = ({form, status, canResetPassword}) => {

    switch(form) {
        case "register":
            return <FormRegister status={status} canResetPassword={canResetPassword} />;
            break;
        case "login":
            return <FormLogin status={status} canResetPassword={canResetPassword} />;
            break;
        case "forgot":
            return <FormForgot status={status} canResetPassword={canResetPassword} />;
            break;
        case "reset":
            return <FormReset status={status} />
        default:
            break;
    }
}
