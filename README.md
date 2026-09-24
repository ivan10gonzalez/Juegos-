# Teatro del azar — demo educativa

Proyecto independiente para una clase sobre diseño de juegos de azar. Gráficos SVG y música sintetizada originales. No copia la marca, los recursos ni las reglas del juego mostrado como referencia.

## Abrir

Abrir `index.html` en un navegador moderno: primero aparece la galería de ejemplos. La tarjeta Teatro del azar abre `teatro-del-azar.html`; dentro del juego hay un enlace para volver. No necesita instalación, cuentas, claves ni conexión a Internet. Si el navegador restringe archivos locales, desde esta carpeta ejecutar `python3 -m http.server 8080` y abrir `http://localhost:8080`.

Para un repositorio estático, subir los archivos conservando su estructura. Repositorio de destino: `ivan10gonzalez/Juegos-`.

## Sonido

Tocar el botón ♫ para activar la música y los efectos. Los navegadores requieren una interacción antes de reproducir audio. La melodía se genera con Web Audio, sin MP3 ni servicios externos. Al cambiar de pestaña se suspende. Se puede silenciar en cualquier momento.

## Alcance

- Cinco rodillos, tres filas, estética violeta y símbolos originales.
- Solo la fila central puntúa, con coincidencias consecutivas desde la izquierda.
- Fichas ficticias; cada sesión didáctica termina a las diez rondas.
- Registro de fichas usadas, recibidas y resultado neto; explicación matemática.
- Sin depósitos, retiros, premios reales, anuncios, cuentas ni datos personales.
- No implementa un casino, proveedor comercial, motor certificado ni funciones de apuesta real.

El modelo usa cinco símbolos equiprobables. Tres iguales exactos pagan 15 veces; cuatro, 50; cinco, 100. Devolución matemática: 96 %. Probabilidad de resultado con pago: 4 %. Los valores son de este modelo ilustrativo, no del juego del video. Una sesión corta puede variar mucho.

## Para la clase

1. Presentar el propósito educativo antes de comenzar.
2. Comparar algunas rondas con y sin sonido.
3. Observar el registro neto, no solo el importe recibido.
4. Abrir «Ver qué hay detrás» y discutir independencia, probabilidades y presentación visual.
5. Aclarar que construir una interfaz no equivale a operar un casino.

## Archivos

- `index.html`, `gallery.css`, `teatro-cover.svg`: galería y portada original.
- `teatro-del-azar.html`: juego y explicación accesible.
- `styles.css`: diseño móvil y adaptación a escritorio.
- `engine.js`: modelo y generación de resultados con Web Crypto.
- `game.js`: gráficos, interacción y composición de audio.
- `tests.cjs`: comprueba todas las 3125 filas posibles y los cálculos.

Pruebas opcionales: `node tests.cjs` (Node 18+). La demostración no necesita Node.

## Agregar más ejemplos

Crear una página independiente para el nuevo ejemplo y agregar una tarjeta dentro de `.cards` en `index.html`, con su enlace, título, descripción e imagen local. Actualizar el contador de ejemplos disponibles. Los enlaces son relativos para funcionar también bajo GitHub Pages.
