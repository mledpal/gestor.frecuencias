import { useEffect } from "react";
import InputLabel from "../InputLabel";
import TextInput from "../TextInput";
import PrimaryButton from "../PrimaryButton";
import InputError from "../InputError";
import { useForm } from "@inertiajs/react";
import { usePantallaPequena } from "@/hooks/usePantallaPequena";

export const FormConfirm = () => {
    const isSmallScreen = usePantallaPequena();

    const { data, setData, post, processing, errors, reset } = useForm({
        password: "",
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route("password.confirm"));
    };

    return (
        <form onSubmit={submit}>
            <p className="text-xs text-rotulo mb-2 text-center">
                Zona segura. Confirma tu contraseña para continuar.
            </p>

            <div className={isSmallScreen ? "w-full" : "w-[50%]"}>
                <InputLabel htmlFor="password" value="Contraseña" />

                <TextInput
                    id="password"
                    type="password"
                    name="password"
                    value={data.password}
                    placeholder="Contraseña"
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData("password", e.target.value)}
                />

                <InputError message={errors.password} className="mt-2" />
            </div>

            <div className="flex items-center justify-end mt-4 p-2">
                <PrimaryButton disabled={processing}>Confirmar</PrimaryButton>
            </div>
        </form>
    );
};
