# Juegos — colección educativa

Abrir `index.html` para elegir un ejemplo. La tarjeta abre la recreación visual; el botón amarillo de cierre vuelve a la galería.

## Recreación de referencia

La versión actual usa `assets/reference-frame.jpg`, un fotograma del video facilitado por el usuario. Canvas muestra solo el área del juego (886 × 1414, desde y=318), excluyendo las barras del teléfono y del navegador. Los símbolos de ese fotograma se reutilizan como atlas durante los giros. Se conserva el diseño visible de la grabación; la información de sesión capturada se sustituye por una identificación de demo educativa.

El sonido usa capas independientes en `audio.js`. Al entrar no se crea un contexto de audio ni suena música. Cambiar realmente la apuesta antes del primer giro activa `music-active.mp3`; el efecto `bet-change.mp3` se dispara una sola vez por cambio. Un giro activa el fondo movido y, diez segundos después de parar, pasa mediante una transición al fondo `music-calm.mp3`. Cambiar la apuesta después de jugar conserva el fondo actual. No hay sonido al intentar superar un límite sin cambiar el importe.

Ambos fondos proceden de tramos sin acciones de los videos del 10/10; el clic se aisló restando la música alineada. `assets/audio-sources.json` documenta cortes y método. Son fragmentos de las grabaciones aportadas, no los archivos maestros del proveedor. Los sonidos de movimiento, parada y premio se recrean por eventos. El menú permite silenciar todo o ajustar música y efectos por separado. Al ocultar la pestaña se pausa el audio; un reinicio vuelve al silencio.

Los nombres, gráficos y sonidos capturados pertenecen al material de referencia. Este proyecto independiente no implica afiliación con el proveedor y no es el juego comercial original. Antes de redistribuir ese material fuera del uso autorizado, verificar sus permisos.

## Alcance interactivo

Giro, ajuste de fichas, velocidad de animación, sonido, pantalla completa (si el navegador la permite), reinicio y menú. Solo fichas ficticias. Tras diez rondas aparece una pausa de análisis.

El motor de demostración es simplificado: cinco símbolos equiprobables, coincidencias de izquierda a derecha en la fila central y pagos 15×, 50× y 100× para tres, cuatro o cinco iguales. Su devolución matemática es 96 % y su probabilidad de pago es 4 %. Estos datos no son los del proveedor; la tabla impresa en la imagen es parte de la referencia visual. Esta distinción aparece en Información. No se programan casi premios ni se adapta el azar a la persona.

No existen depósitos, retiros, cuentas, premios reales ni conexiones al casino.

## Archivos principales

- `index.html` y `gallery.css`: selector de ejemplos.
- `teatro-del-azar.html`, `reference.css`, `reference.js`: recreación visual con controles accesibles.
- `assets/`: fotograma y audio del material facilitado.
- `engine.js` y `tests.cjs`: modelo didáctico y pruebas matemáticas.
- `styles.css`, `game.js`, `teatro-cover.svg`: primera versión de gráficos originales, conservada como material del proyecto; no la carga la página actual del juego.

## Ejecutar y desplegar

Ejecutar `python3 -m http.server 8080` y visitar `http://localhost:8080`. El audio se carga por HTTP(S); no abrir el juego como archivo `file://`. Sin dependencias de ejecución.

Render: sitio estático. El Blueprint `render.yaml` copia los recursos a `dist`. También funciona la configuración manual `echo listo` con Publish Directory `.`.

Pruebas: `node tests.cjs`, `node reels.test.cjs` y `node audio.test.cjs`.

Para añadir otro ejemplo, crear su página y agregar una tarjeta con enlaces relativos en `index.html`.


Actualización de referencia del 24/09: pantalla base limpia del segundo video, recorte que excluye la barra Panel, selector de monedas por línea/valor/total, ajustes de autoplay y vista Hyperplay. Hyperplay simula las rondas sin animación de rodillos y permite pausar. El modelo didáctico conserva el límite de diez rondas por sesión. La fidelidad visual de los diálogos todavía requiere comparación en un navegador; no se afirma una reproducción píxel a píxel.

Rodillos: render continuo por columna con símbolos enmascarados, aceleración y frenado escalonado; el resultado se determina una sola vez antes de animar. Detener el giro acelera su finalización sin cobrar otra ronda. Se respetan las preferencias de movimiento reducido. Validación: tests.cjs, reels.test.cjs, pruebas DOM y renders del canvas real mediante Skia (inicio, movimiento, frenado y parada).


Revisión visual 2026-10-05: sprites con transparencia obtenida en el render a partir del fondo exterior, en lugar de polígonos que cortaban el dibujo; textura medida en la referencia y separadores originales; gráficos de la zona inferior completos, sin parches de texto ni efectos de luz añadidos. Las ventanas de apuesta y autoplay emplean la referencia como superficie gráfica con controles interactivos encima. Todos los tamaños están ligados al ancho del juego. Se añadieron ocho símbolos visuales para el movimiento (el motor didáctico mantiene sus cinco símbolos y sus reglas). Se incluyó la tabla visual de referencia con importes proporcionales a la apuesta y una aclaración visible sobre el modelo.

Validación: motor exhaustivo, trayectoria de rodillos, controles DOM y secuencia del canvas real a 30 fps. La automatización del navegador de esta máquina sigue sin poder iniciarse; los diálogos se revisaron por medidas y controles, no con una captura de navegador. No se afirma una identidad píxel a píxel ni que se disponga del motor, tipografías o archivos fuente del proveedor.


Revisión 2026-10-10: se retiró el audio mezclado de la grabación anterior. Se incorporaron dos fondos sin acciones y el efecto de cambio de apuesta aislado de los nuevos videos. Detener durante un giro frena solo las columnas pendientes en 150–222 ms, conserva la posición inicial de ese frenado y el resultado ya sorteado, y no cobra una segunda ronda. Las columnas ya detenidas permanecen inmóviles. Se verificaron eventos y carreras de carga/silencio con pruebas automáticas; la herramienta de navegador local no pudo iniciarse en este entorno, por lo que no se afirma una escucha ni comprobación manual en un navegador.
