import { SelectForm } from "../Forms/SelectForm";
import { useTeclaFisica } from "@/hooks/useTeclaFisica";
import "./Radio.css";

export const Radio = ({ status, canResetPassword, form }) => {
    const tecla = useTeclaFisica();

    return (
        <div id="radio">
            <div className="container">
                <div className="zonas izquierda">
                    <div className="redondo volume">
                        <span className="texto">MAIN VOL - SQL</span>
                        <div className="btn_radial_in redondo"></div>
                    </div>
                    <div className="redondo squelch">
                        <span className="texto">SUB VOL - TONE</span>
                        <div className="btn_radial_in redondo"></div>
                    </div>
                    <div className="redondo headphone">
                        <span className="texto">PHONES</span>
                    </div>
                </div>
                <div className="zonas centro">
                    <div className="pantalla">
                        <div className="screen">
                            <SelectForm
                                status={status}
                                form={form}
                                canResetPassword={canResetPassword}
                            />
                        </div>
                    </div>

                    <div className="botones_inferior">
                        <div className="boton_inferior">
                            <span className="key_function">SUB SET</span>
                            <div className="btn_inf" {...tecla}>
                                <span className="rotulo">M/S</span>
                            </div>
                        </div>

                        <div className="boton_inferior">
                            <span className="key_function">BS SET</span>
                            <div className="btn_inf" {...tecla}>
                                <span className="rotulo">BS</span>
                            </div>
                        </div>

                        <div className="boton_inferior">
                            <span className="key_function">BS STEP</span>
                            <div className="btn_inf" {...tecla}>
                                <span className="rotulo">WIDTH</span>
                            </div>
                        </div>

                        <div className="boton_inferior">
                            <span className="key_function">MS-SCAN</span>
                            <div className="btn_inf" {...tecla}>
                                <span className="rotulo">SCAN</span>
                            </div>
                        </div>

                        <div className="boton_inferior">
                            <span className="key_function">PMS SET</span>
                            <div className="btn_inf" {...tecla}>
                                <span className="rotulo">PMS</span>
                            </div>
                        </div>

                        <div className="boton_inferior">
                            <span className="key_function">PRI CLR</span>
                            <div className="btn_inf" {...tecla}>
                                <span className="rotulo">CLR</span>
                            </div>
                        </div>

                        <div className="boton_inferior">
                            <span className="key_function">DIM</span>
                            <div className="btn_inf" {...tecla}>
                                <span className="rotulo">DIM</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="zonas derecha">
                    <div className="funciones">
                        <div className="redondo boton_ps" {...tecla}>
                            <span className="rotulo">PS</span>
                        </div>

                        <div className="grupo_tecla">
                            <div className="key_function">ADRS</div>
                            <div className="tecla_funcion especial" {...tecla}>
                                <span className="rotulo">MODE</span>
                            </div>
                        </div>

                        <div className="grupo_tecla">
                            <div className="key_function">REC</div>
                            <div className="tecla_funcion especial" {...tecla}>
                                <span className="rotulo">COPY</span>
                            </div>
                        </div>

                        <div className="grupo_tecla">
                            <div className="key_function">PLAY</div>
                            <div className="tecla_funcion especial" {...tecla}>
                                <span className="rotulo">STEP</span>
                            </div>
                        </div>

                        <div className="grupo_tecla">
                            <div className="key_function">MW</div>
                            <div className="tecla_funcion" {...tecla}>
                                <span className="rotulo">V/M</span>
                            </div>
                        </div>

                        <div className="grupo_tecla">
                            <div className="tecla_subfuncion"></div>
                            <div className="tecla_funcion" {...tecla}>
                                <span className="rotulo">BANK</span>
                            </div>
                        </div>

                        <div className="btn_direccion">
                            <div className="grupo_tecla">
                                <div className="tecla_subfuncion"></div>
                                <div className="tecla_funcion" {...tecla}>
                                    <span className="rotulo"> &lt; </span>
                                </div>
                            </div>

                            <div className="grupo_tecla">
                                <div className="tecla_subfuncion"></div>
                                <div className="tecla_funcion" {...tecla}>
                                    <span className="rotulo"> &gt; </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="teclado">
                        <div className="teclado_derecho">
                            <div className="teclado_derecho_keys">
                                <div className="tecla_subfuncion">
                                    <span className="key_function">ATT</span>
                                </div>
                                <div className="tecla_funcion" {...tecla}>
                                    <span className="rotulo">1</span>
                                </div>
                            </div>
                            <div className="teclado_derecho_keys">
                                <div className="tecla_subfuncion">
                                    <span className="key_function">LOCK</span>
                                </div>
                                <div className="tecla_funcion" {...tecla}>
                                    <span className="rotulo">2</span>
                                </div>
                            </div>
                            <div className="teclado_derecho_keys">
                                <div className="tecla_subfuncion">
                                    <span className="key_function">SEARCH</span>
                                </div>
                                <div className="tecla_funcion" {...tecla}>
                                    <span className="rotulo">3</span>
                                </div>
                            </div>
                            <div className="teclado_derecho_keys">
                                <div className="tecla_subfuncion">
                                    <span className="key_function">SET</span>
                                </div>
                                <div className="tecla_funcion" {...tecla}>
                                    <span className="rotulo">ENT</span>
                                </div>
                            </div>
                            <div className="teclado_derecho_keys">
                                <div className="tecla_subfuncion">
                                    <span className="key_function">SPL</span>
                                </div>
                                <div className="tecla_funcion" {...tecla}>
                                    <span className="rotulo">4</span>
                                </div>
                            </div>
                            <div className="teclado_derecho_keys">
                                <div className="tecla_subfuncion">
                                    <span className="key_function">PRI</span>
                                </div>
                                <div className="tecla_funcion" {...tecla}>
                                    <span className="rotulo">5</span>
                                </div>
                            </div>
                            <div className="teclado_derecho_keys">
                                <div className="tecla_subfuncion">
                                    <span className="key_function">
                                        S. CALL
                                    </span>
                                </div>
                                <div className="tecla_funcion" {...tecla}>
                                    <span className="rotulo">6</span>
                                </div>
                            </div>
                            <div className="teclado_derecho_keys">
                                <div className="tecla_subfuncion">
                                    <span className="key_function">BEEP</span>
                                </div>
                                <div className="tecla_funcion" {...tecla}>
                                    <span className="rotulo">.</span>
                                </div>
                            </div>
                            <div className="teclado_derecho_keys">
                                <div className="tecla_subfuncion">
                                    <span className="key_function">VCS</span>
                                </div>
                                <div className="tecla_funcion" {...tecla}>
                                    <span className="rotulo">7</span>
                                </div>
                            </div>
                            <div className="teclado_derecho_keys">
                                <div className="tecla_subfuncion">
                                    <span className="key_function">
                                        RF TUNE
                                    </span>
                                </div>
                                <div className="tecla_funcion" {...tecla}>
                                    <span className="rotulo">8</span>
                                </div>
                            </div>
                            <div className="teclado_derecho_keys">
                                <div className="tecla_subfuncion">
                                    <span className="key_function">TIMER</span>
                                </div>
                                <div className="tecla_funcion" {...tecla}>
                                    <span className="rotulo">9</span>
                                </div>
                            </div>
                            <div className="teclado_derecho_keys">
                                <div className="tecla_subfuncion">
                                    <span className="key_function">NB</span>
                                </div>
                                <div className="tecla_funcion" {...tecla}>
                                    <span className="rotulo">0</span>
                                </div>
                            </div>
                        </div>

                        <div className="otros">
                            <div className="btn_funcion redondo">
                                <div className="btn_f">
                                    <span className="rotulo">F</span>
                                </div>
                            </div>

                            <div className="btn_dsp">
                                <div className="tecla_funcion" {...tecla}>
                                    <span className="rotulo">DSP</span>
                                </div>
                            </div>

                            <div className="btn_radial redondo">
                                <div className="btn_radial_in redondo"></div>
                                <div className="btn_menu hidden"></div>
                                <div className="btn_up hidden"></div>
                                <div className="btn_down hidden"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
