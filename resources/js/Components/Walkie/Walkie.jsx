import { SelectForm } from "../Forms/SelectForm";
import "./walkie.css";
import "./js/walkie";

export const Walkie = ({ status, canResetPassword, form }) => {
    return (
        <div id="walkie">
            <div className="superior">
                <div className="antena"></div>
                <div className="led_on"></div>
                <div className="rueda"></div>
            </div>

            <div className="container">
                <div className="pantalla">
                    <div className="borde_screen">
                        <div className="screen">
                            <SelectForm
                                status={status}
                                form={form}
                                canResetPassword={canResetPassword}
                            />
                        </div>
                    </div>
                </div>

                <div className="altavoz">
                    <div className="btn_spk">
                        <div className="btn_spk_sup">
                            <div className="btn_menu">
                                <span className="key_text">MENU</span>
                            </div>
                        </div>

                        <div className="btn_spk_inf">
                            <div className="btn_up">
                                <div className="btn_up_in"></div>
                            </div>
                            <div className="btn_down">
                                <div className="btn_down_in"></div>
                            </div>
                        </div>

                        <div className="btn_exit">
                            <div className="tecla">
                                <span className="key_text">EXIT</span>
                            </div>
                        </div>
                    </div>

                    <div className="speaker"></div>
                </div>

                <div className="botonera">
                    <div className="tecla">
                        <span className="key_text">1</span>
                        <small>Band</small>
                    </div>
                    <div className="tecla">
                        <span className="key_text">2</span>
                        <small>A/B</small>
                    </div>
                    <div className="tecla">
                        <span className="key_text">3</span>
                        <small>VFO MR</small>
                    </div>
                    <div className="tecla">
                        <span className="key_text">*</span>
                        <small>Scan</small>
                    </div>
                    <div className="tecla">
                        <span className="key_text">4</span>
                        <small>FC</small>
                    </div>
                    <div className="tecla">
                        <span className="key_text">5</span>
                        <small>NOAA</small>
                    </div>
                    <div className="tecla">
                        <span className="key_text">6</span>
                        <small>H/M/L</small>
                    </div>
                    <div className="tecla">
                        <span className="key_text">0</span>
                        <small>FM</small>
                    </div>
                    <div className="tecla">
                        <span className="key_text">7</span>
                        <small>VOX</small>
                    </div>
                    <div className="tecla">
                        <span className="key_text">8</span>
                        <small>R</small>
                    </div>
                    <div className="tecla">
                        <span className="key_text">9</span>
                        <small>Call</small>
                    </div>
                    <div className="tecla">
                        <span className="key_text">F</span>
                        <small>#</small>
                    </div>
                </div>
            </div>
            <script src="./js/walkie.js"></script>
        </div>
    );
};
