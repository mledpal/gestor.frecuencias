import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";

import { Mensaje } from "../Mensajes/Mensaje";

import { BotonesFormulario } from "../BotonesFormulario/BotonesFormulario";
import { RotatingLines } from "react-loader-spinner";
import { useConversacion } from "@/hooks/useConversacion";
import { useEffect, useState } from "react";

export const Conversacion = ({
    handleOpenSendMessage,
    userID,
    userDB,
    setVista,
    isSmallScreen,
}) => {
    const {
        clasesLabel,
        conversacion,
        userData,
        data,
        setData,
        errors,
        submit,
        csrf,
        setCSRF,
    } = useConversacion(userID, userDB);

    useEffect(() => {
        setCSRF(csrf);
        setData({ _token: csrf });
    }, []);

    return (
        <div
            id="conversacion"
            className={` ${
                isSmallScreen
                    ? "w-screen"
                    : "w-2/4 shadow-[0px_0px_15px_rgba(255,255,255,.5)]"
            }   max-h-screen h-screen overflow-y-auto flex flex-col items-center justify-between  rounded-xl m-auto`}
        >
            <header
                className={`${
                    isSmallScreen
                        ? ""
                        : "shadow-[inset_2px_0_5px_rgba(255,255,255,.5),inset_-2px_0_5px_rgba(0,0,0,.5)] "
                } sticky top-0 h-50 w-full flex flex-col items-center justify-center bg-gradient-to-tl from-blue-900 bg-slate-800 rounded-tr-xl rounded-tl-xl p-5 font-bold text-xl `}
            >
                {userData ? (
                    <div className="h-[75px] w-full flex flex-row gap-4 items-center justify-center">
                        <img
                            src={userData.photo}
                            className=" w-[70px] h-[70px] rounded-full"
                        />
                        <span className=" backdrop-blur-md">
                            {userData.username}
                            <h2>ID De usuario : {data.destinatario_id}</h2>
                        </span>
                    </div>
                ) : (
                    ""
                )}
            </header>

            <form
                name="conversacion"
                method="post"
                onSubmit={submit}
                encType="multipart/form-data"
                className="h-full w-full flex flex-col justify-between"
            >
                <input
                    name="destinatario_id"
                    type="hidden"
                    value={data.destinatario_id ?? ""}
                />

                <input name="_token" type="hidden" value={data.csrf ?? ""} />

                <main className="flex flex-col grow bg-gradient-to-br from-slate-800  to-gray-800 pb-5 ">
                    <div className=" sticky top-[131px] flex flex-col items-center justify-between px-4 gap-4 mt-4 bg-slate-800 ">
                        <div className="w-full">
                            {data.destinatario_id ? (
                                <>
                                    <InputLabel
                                        htmlFor="mensaje"
                                        value="Escriba un mensaje"
                                        className={clasesLabel}
                                    />
                                    <TextInput
                                        id="mensaje"
                                        name="mensaje"
                                        value={data.mensaje ?? ""}
                                        className="mt-1 block w-full text-center"
                                        onChange={(e) =>
                                            setData("mensaje", e.target.value)
                                        }
                                        onSubmit={submit}
                                        placeholder="mensaje"
                                        autoComplete="off"
                                    />
                                </>
                            ) : (
                                <div className="w-full grid place-items-center">
                                    <RotatingLines
                                        visible={true}
                                        height="96"
                                        width="96"
                                        color="grey"
                                        strokeWidth="5"
                                        animationDuration="0.75"
                                        ariaLabel="rotating-lines-loading"
                                        wrapperStyle={{}}
                                        wrapperClass=""
                                    />
                                </div>
                            )}

                            <InputError
                                message={errors.mensaje}
                                className="mt-2"
                            />
                        </div>
                        <div className="w-full flex flex-row items-center justify-end gap-3 p-4">
                            {data.destinatario_id ? (
                                <BotonesFormulario
                                    actionSubmit={submit}
                                    actionReset={() => reset("mensaje")}
                                    actionExit={() => {
                                        handleOpenSendMessage
                                            ? handleOpenSendMessage()
                                            : setVista("movil");
                                    }}
                                />
                            ) : (
                                ""
                            )}
                        </div>
                    </div>

                    <article className="w-full text-center h-full p-4 flex flex-col items-center justify-start gap-2 ">
                        {conversacion
                            ? conversacion.map((msg, index) => {
                                  return (
                                      <span
                                          className="w-full  odd:bg-slate-800 even:bg-slate-700 "
                                          key={index}
                                      >
                                          <Mensaje datos={msg} />
                                      </span>
                                  );
                              })
                            : "No hay mensajes"}
                    </article>
                </main>

                {/* <footer className="sticky bottom-0 p-5 flex items-center justify-around h-15 bg-gradient-to-br from-blue-900 bg-slate-800 rounded-br-xl rounded-bl-xl font-bold text-xl shadow-[inset_2px_0_5px_rgba(255,255,255,.5),inset_-2px_0_5px_rgba(0,0,0,.5)] "></footer> */}
            </form>
        </div>
    );
};
