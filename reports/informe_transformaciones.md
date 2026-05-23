# Informe de transformaciones Spotify

## Juan Pablo Orihuela Araiza
- Carpeta fuente: `/Users/JP/Desktop/UP/8vo Semestre/BigData/Exploración y Comprensión de los Datos/Spotify Extended Streaming History`.
- JSON de audio leidos: 17. JSON de video detectados: 1 con 342 registros disponibles.
- Filas crudas de audio: 262,840.
- Duplicados exactos removidos: 220.
- Grupos anomalos timestamp+platform colapsados: 3,430.
- Filas removidas por colapso conservador: 83,711.
- Filas limpias finales: 178,909.

## Aranza Romo Lima
- Carpeta fuente: `/Users/JP/Desktop/UP/8vo Semestre/BigData/Exploración y Comprensión de los Datos/Spotify Extended Streaming History 2`.
- JSON de audio leidos: 24. JSON de video detectados: 9 con 503 registros disponibles.
- Filas crudas de audio: 284,882.
- Duplicados exactos removidos: 127.
- Grupos anomalos timestamp+platform colapsados: 3,499.
- Filas removidas por colapso conservador: 42,751.
- Filas limpias finales: 242,004.

## Transformaciones comunes
- Conversion de `ts` UTC a `datetime_local` en `America/Mexico_City`.
- Derivacion de fecha, mes, semana ISO, dia de semana, hora, bloque horario y fin de semana.
- Normalizacion de plataforma en categorias de dispositivo.
- Clasificacion de contenido en track, episode u other.
- Construccion de sesiones con separacion mayor a 30 minutos.
- Exportacion sin direcciones IP.
