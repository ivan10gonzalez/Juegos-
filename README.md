# Juegos — colección educativa

Abrir `index.html` para elegir un ejemplo. La tarjeta abre la recreación visual; el botón amarillo de cierre vuelve a la galería.

## Recreación de referencia

La versión actual usa `assets/reference-frame.jpg`, un fotograma del video facilitado por el usuario. Canvas muestra solo el área del juego (886 × 1483, desde y=249), excluyendo las barras del teléfono y del navegador. Los símbolos de ese fotograma se reutilizan como atlas durante los giros. Se conserva el diseño visible de la grabación; la información de sesión capturada se sustituye por una identificación de demo educativa.

El audio opcional `assets/reference-audio.mp3` procede de un fragmento de seis segundos del mismo video, reproducido en bucle. No es la pista original completa del proveedor. Requiere un toque para activarse y se pausa al ocultar la pestaña.

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

Abrir `index.html`, o ejecutar `python3 -m http.server 8080` y visitar `http://localhost:8080`. Sin dependencias de ejecución.

Render: sitio estático. El Blueprint `render.yaml` copia los recursos a `dist`. También funciona la configuración manual `echo listo` con Publish Directory `.`.

Pruebas del modelo: `node tests.cjs`.

Para añadir otro ejemplo, crear su página y agregar una tarjeta con enlaces relativos en `index.html`.


Actualización de referencia del 24/09: pantalla base limpia del segundo video, recorte que excluye la barra Panel, selector de monedas por línea/valor/total, ajustes de autoplay y vista Hyperplay. El audio opcional utiliza 30 segundos de la grabación aportada; se activa desde el menú. Hyperplay simula las rondas sin animación de rodillos y permite pausar. El modelo didáctico conserva el límite de diez rondas por sesión. La fidelidad visual de los diálogos todavía requiere comparación en un navegador; no se afirma una reproducción píxel a píxel.
