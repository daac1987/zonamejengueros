-- CreateTable
CREATE TABLE "usuario" (
    "usuario_id" SERIAL NOT NULL,
    "nombre_usuario" TEXT NOT NULL,
    "email_usuario" TEXT NOT NULL,
    "contrasena_usuario" TEXT NOT NULL,
    "fecha_usuario" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email_verificado" BOOLEAN NOT NULL DEFAULT false,
    "ultima_sesion" TIMESTAMP(3),

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("usuario_id")
);

-- CreateTable
CREATE TABLE "cancha" (
    "cancha_id" SERIAL NOT NULL,
    "nombre_cancha" TEXT NOT NULL,
    "telefono_cancha" TEXT,
    "provincia_cancha" TEXT,
    "ubicacion_cancha" TEXT,
    "encargado_cancha" TEXT,
    "horario_cancha" TEXT,
    "grama_cancha" TEXT,
    "cantidad_jugadores_id" INTEGER,
    "precio_cancha" INTEGER NOT NULL,
    "servicios_cancha" TEXT,
    "sede_url" TEXT,
    "foto_sede_uno_url" TEXT,
    "foto_sede_dos_url" TEXT,
    "fecha_cancha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cancha_pkey" PRIMARY KEY ("cancha_id")
);

-- CreateTable
CREATE TABLE "equipo" (
    "equipo_id" SERIAL NOT NULL,
    "nombre_equipo" TEXT NOT NULL,
    "telefono_equipo" TEXT,
    "provincia_equipo" TEXT,
    "ubicacion_equipo" TEXT,
    "encargado_equipo" TEXT,
    "logros_equipo" TEXT NOT NULL,
    "categoria_equipo_id" INTEGER,
    "cantidad_jugadores_id" INTEGER,
    "logo_url" TEXT,
    "foto_equipo_uno_url" TEXT,
    "foto_equipo_dos_url" TEXT,
    "fecha_equipo" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "equipo_pkey" PRIMARY KEY ("equipo_id")
);

-- CreateTable
CREATE TABLE "goleador" (
    "jugador_id" SERIAL NOT NULL,
    "nombre_jugador" TEXT NOT NULL,
    "goles_jugador" INTEGER NOT NULL,
    "inscripcionTorneo_id" INTEGER NOT NULL,

    CONSTRAINT "goleador_pkey" PRIMARY KEY ("jugador_id")
);

-- CreateTable
CREATE TABLE "inscripciones_torneo" (
    "inscripcionTorneo_id" SERIAL NOT NULL,
    "fecha_inscripcion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "equipo_id" INTEGER NOT NULL,
    "torneo_id" INTEGER NOT NULL,

    CONSTRAINT "inscripciones_torneo_pkey" PRIMARY KEY ("inscripcionTorneo_id")
);

-- CreateTable
CREATE TABLE "noticia" (
    "noticia_id" SERIAL NOT NULL,
    "categoria_noticia_id" INTEGER,
    "titulo_noticia" TEXT NOT NULL,
    "texto_noticia" TEXT NOT NULL,
    "foto_noticia_url" TEXT,

    CONSTRAINT "noticia_pkey" PRIMARY KEY ("noticia_id")
);

-- CreateTable
CREATE TABLE "publicacion_noticia" (
    "publicacionNoticia_id" SERIAL NOT NULL,
    "noticia_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "fecha_noticia" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "publicacion_noticia_pkey" PRIMARY KEY ("publicacionNoticia_id")
);

-- CreateTable
CREATE TABLE "sede_equipo" (
    "sedeEquipo_id" SERIAL NOT NULL,
    "equipo_id" INTEGER NOT NULL,
    "cancha_id" INTEGER NOT NULL,

    CONSTRAINT "sede_equipo_pkey" PRIMARY KEY ("sedeEquipo_id")
);

-- CreateTable
CREATE TABLE "sede_torneo" (
    "sedeTorneo_id" SERIAL NOT NULL,
    "torneo_id" INTEGER NOT NULL,
    "cancha_id" INTEGER NOT NULL,

    CONSTRAINT "sede_torneo_pkey" PRIMARY KEY ("sedeTorneo_id")
);

-- CreateTable
CREATE TABLE "tabla_posiciones" (
    "posicion_id" SERIAL NOT NULL,
    "puntos_ganados" INTEGER NOT NULL,
    "partidos_jugados" INTEGER NOT NULL,
    "diferencia_gol" INTEGER NOT NULL,
    "inscripcionTorneo_id" INTEGER NOT NULL,

    CONSTRAINT "tabla_posiciones_pkey" PRIMARY KEY ("posicion_id")
);

-- CreateTable
CREATE TABLE "torneo" (
    "torneo_id" SERIAL NOT NULL,
    "nombre_torneo" TEXT NOT NULL,
    "telefono_torneo" TEXT,
    "provincia_torneo" TEXT,
    "ubicacion_torneo" TEXT,
    "encargado_torneo" TEXT,
    "cantidad_equipos_torneo" INTEGER,
    "cantidad_jugadores_id" INTEGER,
    "categoria_equipo_id" INTEGER,
    "especificaciones_torneo" TEXT,
    "precio_inscripcion_torneo" INTEGER NOT NULL,
    "premioUno_torneo" TEXT,
    "premioDos_torneo" TEXT,
    "premioTres_torneo" TEXT,
    "logo_url" TEXT,
    "fecha_torneo" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado_torneo" TEXT NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "torneo_pkey" PRIMARY KEY ("torneo_id")
);

-- CreateTable
CREATE TABLE "usuario_cancha" (
    "usuarioCancha_id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "cancha_id" INTEGER NOT NULL,

    CONSTRAINT "usuario_cancha_pkey" PRIMARY KEY ("usuarioCancha_id")
);

-- CreateTable
CREATE TABLE "usuario_equipo" (
    "usuarioEquipo_id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "equipo_id" INTEGER NOT NULL,

    CONSTRAINT "usuario_equipo_pkey" PRIMARY KEY ("usuarioEquipo_id")
);

-- CreateTable
CREATE TABLE "usuario_torneo" (
    "usuarioTorneo_id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "torneo_id" INTEGER NOT NULL,

    CONSTRAINT "usuario_torneo_pkey" PRIMARY KEY ("usuarioTorneo_id")
);

-- CreateTable
CREATE TABLE "cantidad_jugadores" (
    "cantidad_jugadores_id" SERIAL NOT NULL,
    "cantidad_jugadores" TEXT NOT NULL,

    CONSTRAINT "cantidad_jugadores_pkey" PRIMARY KEY ("cantidad_jugadores_id")
);

-- CreateTable
CREATE TABLE "categoria_equipo" (
    "categoria_equipo_id" SERIAL NOT NULL,
    "categoria_equipo" TEXT NOT NULL,

    CONSTRAINT "categoria_equipo_pkey" PRIMARY KEY ("categoria_equipo_id")
);

-- CreateTable
CREATE TABLE "categoria_noticia" (
    "categoria_noticia_id" SERIAL NOT NULL,
    "categoria_noticia" TEXT NOT NULL,

    CONSTRAINT "categoria_noticia_pkey" PRIMARY KEY ("categoria_noticia_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_usuario_key" ON "usuario"("email_usuario");

-- CreateIndex
CREATE INDEX "cancha_cantidad_jugadores_id_idx" ON "cancha"("cantidad_jugadores_id");

-- CreateIndex
CREATE INDEX "equipo_categoria_equipo_id_idx" ON "equipo"("categoria_equipo_id");

-- CreateIndex
CREATE INDEX "equipo_cantidad_jugadores_id_idx" ON "equipo"("cantidad_jugadores_id");

-- CreateIndex
CREATE INDEX "inscripcionTorneo_id" ON "goleador"("inscripcionTorneo_id");

-- CreateIndex
CREATE INDEX "inscripciones_torneo_equipo_id_idx" ON "inscripciones_torneo"("equipo_id");

-- CreateIndex
CREATE INDEX "inscripciones_torneo_torneo_id_idx" ON "inscripciones_torneo"("torneo_id");

-- CreateIndex
CREATE INDEX "noticia_categoria_noticia_id_idx" ON "noticia"("categoria_noticia_id");

-- CreateIndex
CREATE INDEX "publicacion_noticia_noticia_id_idx" ON "publicacion_noticia"("noticia_id");

-- CreateIndex
CREATE INDEX "publicacion_noticia_usuario_id_idx" ON "publicacion_noticia"("usuario_id");

-- CreateIndex
CREATE INDEX "sede_equipo_cancha_id_idx" ON "sede_equipo"("cancha_id");

-- CreateIndex
CREATE INDEX "sede_equipo_equipo_id_idx" ON "sede_equipo"("equipo_id");

-- CreateIndex
CREATE INDEX "sede_torneo_cancha_id_idx" ON "sede_torneo"("cancha_id");

-- CreateIndex
CREATE INDEX "sede_torneo_torneo_id_idx" ON "sede_torneo"("torneo_id");

-- CreateIndex
CREATE INDEX "tabla_posiciones_inscripcionTorneo_id_idx" ON "tabla_posiciones"("inscripcionTorneo_id");

-- CreateIndex
CREATE INDEX "torneo_categoria_equipo_id_idx" ON "torneo"("categoria_equipo_id");

-- CreateIndex
CREATE INDEX "torneo_cantidad_jugadores_id_idx" ON "torneo"("cantidad_jugadores_id");

-- CreateIndex
CREATE INDEX "usuario_cancha_cancha_id_idx" ON "usuario_cancha"("cancha_id");

-- CreateIndex
CREATE INDEX "usuario_cancha_usuario_id_idx" ON "usuario_cancha"("usuario_id");

-- CreateIndex
CREATE INDEX "usuario_equipo_equipo_id_idx" ON "usuario_equipo"("equipo_id");

-- CreateIndex
CREATE INDEX "usuario_equipo_usuario_id_idx" ON "usuario_equipo"("usuario_id");

-- CreateIndex
CREATE INDEX "usuario_torneo_torneo_id_idx" ON "usuario_torneo"("torneo_id");

-- CreateIndex
CREATE INDEX "usuario_torneo_usuario_id_idx" ON "usuario_torneo"("usuario_id");

-- AddForeignKey
ALTER TABLE "cancha" ADD CONSTRAINT "fk_cancha_cantidad_jugadores" FOREIGN KEY ("cantidad_jugadores_id") REFERENCES "cantidad_jugadores"("cantidad_jugadores_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "equipo" ADD CONSTRAINT "equipo_ibfk_1" FOREIGN KEY ("categoria_equipo_id") REFERENCES "categoria_equipo"("categoria_equipo_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "equipo" ADD CONSTRAINT "fk_equipo_cantidad_jugadores" FOREIGN KEY ("cantidad_jugadores_id") REFERENCES "cantidad_jugadores"("cantidad_jugadores_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "goleador" ADD CONSTRAINT "goleador_ibfk_1" FOREIGN KEY ("inscripcionTorneo_id") REFERENCES "inscripciones_torneo"("inscripcionTorneo_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "inscripciones_torneo" ADD CONSTRAINT "inscripciones_torneo_ibfk_1" FOREIGN KEY ("equipo_id") REFERENCES "equipo"("equipo_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "inscripciones_torneo" ADD CONSTRAINT "inscripciones_torneo_ibfk_2" FOREIGN KEY ("torneo_id") REFERENCES "torneo"("torneo_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "noticia" ADD CONSTRAINT "noticia_ibfk_1" FOREIGN KEY ("categoria_noticia_id") REFERENCES "categoria_noticia"("categoria_noticia_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "publicacion_noticia" ADD CONSTRAINT "publicacion_noticia_ibfk_1" FOREIGN KEY ("noticia_id") REFERENCES "noticia"("noticia_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "publicacion_noticia" ADD CONSTRAINT "publicacion_noticia_ibfk_2" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("usuario_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "sede_equipo" ADD CONSTRAINT "sede_equipo_ibfk_1" FOREIGN KEY ("equipo_id") REFERENCES "equipo"("equipo_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "sede_equipo" ADD CONSTRAINT "sede_equipo_ibfk_2" FOREIGN KEY ("cancha_id") REFERENCES "cancha"("cancha_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "sede_torneo" ADD CONSTRAINT "sede_torneo_ibfk_1" FOREIGN KEY ("torneo_id") REFERENCES "torneo"("torneo_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "sede_torneo" ADD CONSTRAINT "sede_torneo_ibfk_2" FOREIGN KEY ("cancha_id") REFERENCES "cancha"("cancha_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "tabla_posiciones" ADD CONSTRAINT "tabla_posiciones_ibfk_1" FOREIGN KEY ("inscripcionTorneo_id") REFERENCES "inscripciones_torneo"("inscripcionTorneo_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "torneo" ADD CONSTRAINT "fk_torneo_cantidad_jugadores" FOREIGN KEY ("cantidad_jugadores_id") REFERENCES "cantidad_jugadores"("cantidad_jugadores_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "torneo" ADD CONSTRAINT "torneo_ibfk_1" FOREIGN KEY ("categoria_equipo_id") REFERENCES "categoria_equipo"("categoria_equipo_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "usuario_cancha" ADD CONSTRAINT "usuario_cancha_ibfk_1" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("usuario_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "usuario_cancha" ADD CONSTRAINT "usuario_cancha_ibfk_2" FOREIGN KEY ("cancha_id") REFERENCES "cancha"("cancha_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "usuario_equipo" ADD CONSTRAINT "usuario_equipo_ibfk_1" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("usuario_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "usuario_equipo" ADD CONSTRAINT "usuario_equipo_ibfk_2" FOREIGN KEY ("equipo_id") REFERENCES "equipo"("equipo_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "usuario_torneo" ADD CONSTRAINT "usuario_torneo_ibfk_1" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("usuario_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "usuario_torneo" ADD CONSTRAINT "usuario_torneo_ibfk_2" FOREIGN KEY ("torneo_id") REFERENCES "torneo"("torneo_id") ON DELETE RESTRICT ON UPDATE RESTRICT;
