drop database frecuencias;
create database frecuencias;
use frecuencias;

DROP TABLE IF EXISTS frecuencia;
DROP TABLE if EXISTS servicio;
DROP TABLE if EXISTS bandas;
DROP table if EXISTS usos;

create table bandas (
    id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100),
    PRIMARY KEY (id)
) ENGINE=INNODB DEFAULT CHARSET=utf8;

create table frecuencia (
    id INT NOT NULL AUTO_INCREMENT,
    modo VARCHAR(10) NOT NULL,
    mhz INT NOT NULL,
    khz INT NOT NULL,
    banda INT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_fre_ban FOREIGN KEY (banda) REFERENCES bandas(id)
) ENGINE=INNODB DEFAULT CHARSET=utf8;


create table servicio (
    id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    localidad VARCHAR(100),
    provincia VARCHAR(100),
    PRIMARY KEY (id)
) ENGINE=INNODB DEFAULT CHARSET=utf8;

create table emision (
    idservicio INT NOT NULL,
    idfrecuencia INT NOT NULL,
    fecha DATE,
    codificacion VARCHAR(10),
    repetidor BOOLEAN,
    offset FLOAT(4,3),
    calidad INT,
    cctss VARCHAR(5),
    dcs VARCHAR(5),
    secrafonia BOOLEAN,
    observaciones VARCHAR(255),
    comprobada BOOLEAN,
    CONSTRAINT fk_emi_ser FOREIGN KEY (idservicio) REFERENCES servicio(id),
    CONSTRAINT fk_emi_fre FOREIGN KEY (idfrecuencia) REFERENCES frecuencia(id),
    CONSTRAINT pk_emision PRIMARY KEY (idservicio, idfrecuencia) 
) ENGINE=INNODB DEFAULT CHARSET=utf8;

-- INSERCIÓN DE DATOS

INSERT INTO bandas (nombre) VALUES ('2m');
INSERT INTO bandas (nombre) VALUES ('70cm');
INSERT INTO bandas (nombre) VALUES ('Aérea');
INSERT INTO bandas (nombre) VALUES ('FM Comercial');
INSERT INTO bandas (nombre) VALUES ('HF');
INSERT INTO bandas (nombre) VALUES ('27 Mhz');
INSERT INTO bandas (nombre) VALUES ('900 Mhz');

INSERT INTO servicio (nombre, localidad, provincia) VALUES ('Policía Local', 'Linares', 'Jaén');
INSERT INTO servicio (nombre, localidad, provincia) VALUES ('Policía Local', 'Jaén', 'Jaén');
INSERT INTO servicio (nombre, localidad, provincia) VALUES ('Policía Local', 'Martos', 'Jaén');
INSERT INTO servicio (nombre, localidad, provincia) VALUES ('Policía Local', 'Úbeda', 'Jaén');
INSERT INTO servicio (nombre, localidad, provincia) VALUES ('Policía Local', 'Puertollano', 'Ciudad Real');
INSERT INTO servicio (nombre, localidad, provincia) VALUES ('Policía Local', 'Baeza', 'Jaén');
INSERT INTO servicio (nombre, localidad, provincia) VALUES ('Bomberos', 'Linares', 'Jaén');
INSERT INTO servicio (nombre, localidad, provincia) VALUES ('Bomberos', 'Jaén', 'Jaén');
INSERT INTO servicio (nombre, localidad, provincia) VALUES ('Protección Civil', 'Linares', 'Jaén');

