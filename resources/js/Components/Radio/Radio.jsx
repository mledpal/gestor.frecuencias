import { SelectForm } from "../Forms/SelectForm";
import "./Radio.css";
import "./js/boton.js";

// import "./handleBotones";

export const Radio = ({ status, canResetPassword, form }) => {
    return (
        <div id="radio">
            <div className="container max-[1280px]:scale-75">
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
                            <div className="btn_inf">
                                <span className="tecla">M/S</span>
                            </div>
                        </div>

                        <div className="boton_inferior">
                            <span className="key_function">BS SET</span>
                            <div className="btn_inf">
                                <span className="tecla">BS</span>
                            </div>
                        </div>

                        <div className="boton_inferior">
                            <span className="key_function">BS STEP</span>
                            <div className="btn_inf">
                                <span className="tecla">WIDTH</span>
                            </div>
                        </div>

                        <div className="boton_inferior">
                            <span className="key_function">MS-SCAN</span>
                            <div className="btn_inf">
                                <span className="tecla">SCAN</span>
                            </div>
                        </div>

                        <div className="boton_inferior">
                            <span className="key_function">PMS SET</span>
                            <div className="btn_inf">
                                <span className="tecla">PMS</span>
                            </div>
                        </div>

                        <div className="boton_inferior">
                            <span className="key_function">PRI CLR</span>
                            <div className="btn_inf">
                                <span className="tecla">CLR</span>
                            </div>
                        </div>

                        <div className="boton_inferior">
                            <span className="key_function">DIM</span>
                            <div className="btn_inf">
                                <span className="tecla">DIM</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="zonas derecha">
                    <div className="funciones">
                        <div className="redondo boton_ps">
                            <span className="tecla">PS</span>
                        </div>

                        <div className="tecla">
                            <div className="key_function">ADRS</div>
                            <div className="tecla_funcion especial">
                                <span className="tecla ">MODE</span>
                            </div>
                        </div>

                        <div className="tecla">
                            <div className="key_function">REC</div>
                            <div className="tecla_funcion especial">
                                <span className="tecla ">COPY</span>
                            </div>
                        </div>

                        <div className="tecla">
                            <div className="key_function">PLAY</div>
                            <div className="tecla_funcion especial">
                                <span className="tecla ">STEP</span>
                            </div>
                        </div>

                        <div className="tecla">
                            <div className="key_function">MW</div>
                            <div className="tecla_funcion">
                                <span className="tecla">V/M</span>
                            </div>
                        </div>

                        <div className="tecla">
                            <div className="tecla_subfuncion"></div>
                            <div className="tecla_funcion">
                                <span className="tecla">BANK</span>
                            </div>
                        </div>

                        <div className="btn_direccion">
                            <div className="tecla">
                                <div className="tecla_subfuncion"></div>
                                <div className="tecla_funcion">
                                    <span className="tecla"> &lt; </span>
                                </div>
                            </div>

                            <div className="tecla">
                                <div className="tecla_subfuncion"></div>
                                <div className="tecla_funcion">
                                    <span className="tecla"> &gt; </span>
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
                                <div className="tecla_funcion">
                                    <span className="tecla">1</span>
                                </div>
                            </div>
                            <div className="teclado_derecho_keys">
                                <div className="tecla_subfuncion">
                                    <span className="key_function">LOCK</span>
                                </div>
                                <div className="tecla_funcion">
                                    <span className="tecla">2</span>
                                </div>
                            </div>
                            <div className="teclado_derecho_keys">
                                <div className="tecla_subfuncion">
                                    <span className="key_function">SEARCH</span>
                                </div>
                                <div className="tecla_funcion">
                                    <span className="tecla">3</span>
                                </div>
                            </div>
                            <div className="teclado_derecho_keys">
                                <div className="tecla_subfuncion">
                                    <span className="key_function">SET</span>
                                </div>
                                <div className="tecla_funcion">
                                    <span className="tecla">ENT</span>
                                </div>
                            </div>
                            <div className="teclado_derecho_keys">
                                <div className="tecla_subfuncion">
                                    <span className="key_function">SPL</span>
                                </div>
                                <div className="tecla_funcion">
                                    <span className="tecla">4</span>
                                </div>
                            </div>
                            <div className="teclado_derecho_keys">
                                <div className="tecla_subfuncion">
                                    <span className="key_function">PRI</span>
                                </div>
                                <div className="tecla_funcion">
                                    <span className="tecla">5</span>
                                </div>
                            </div>
                            <div className="teclado_derecho_keys">
                                <div className="tecla_subfuncion">
                                    <span className="key_function">
                                        S. CALL
                                    </span>
                                </div>
                                <div className="tecla_funcion">
                                    <span className="tecla">6</span>
                                </div>
                            </div>
                            <div className="teclado_derecho_keys">
                                <div className="tecla_subfuncion">
                                    <span className="key_function">BEEP</span>
                                </div>
                                <div className="tecla_funcion">
                                    <span className="tecla">.</span>
                                </div>
                            </div>
                            <div className="teclado_derecho_keys">
                                <div className="tecla_subfuncion">
                                    <span className="key_function">VCS</span>
                                </div>
                                <div className="tecla_funcion">
                                    <span className="tecla">7</span>
                                </div>
                            </div>
                            <div className="teclado_derecho_keys">
                                <div className="tecla_subfuncion">
                                    <span className="key_function">
                                        RF TUNE
                                    </span>
                                </div>
                                <div className="tecla_funcion">
                                    <span className="tecla">8</span>
                                </div>
                            </div>
                            <div className="teclado_derecho_keys">
                                <div className="tecla_subfuncion">
                                    <span className="key_function">TIMER</span>
                                </div>
                                <div className="tecla_funcion">
                                    <span className="tecla">9</span>
                                </div>
                            </div>
                            <div className="teclado_derecho_keys">
                                <div className="tecla_subfuncion">
                                    <span className="key_function">NB</span>
                                </div>
                                <div className="tecla_funcion">
                                    <span className="tecla">0</span>
                                </div>
                            </div>
                        </div>

                        <div className="otros">
                            <div className="btn_funcion redondo">
                                <div className="btn_f">
                                    <span className="tecla">F</span>
                                </div>
                            </div>

                            <div className="btn_dsp">
                                <div className="tecla_funcion">
                                    <span className="tecla">DSP</span>
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
