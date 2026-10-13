# Ceniza

Juego de supervivencia zombi para navegador con cámara en tercera persona sobre el hombro. Mundo infinito generado por chunks, casas con interiores y combate cuerpo a cuerpo inspirado en los clásicos del género. Funciona en PC, en móvil y con mando.

> "Ceniza" es un nombre provisional. Es un proyecto inspirado en el género de supervivencia; todo el arte, el código y los nombres son propios.

## Estado

**Bloque 1: base y zombis lentos**
- Zombis lentos que caminan al azar; te persiguen si te ven de frente o si corres cerca

**Bloque 2: mundo infinito**
- Chunks de 32x32 que se generan al acercarte; lo que dejas atrás se conserva
- Los zombis lejanos se duermen y despiertan donde los dejaste

**Bloque 3: tercera persona, casas y combate**
- Cámara sobre el hombro que se acerca al apuntar y no atraviesa paredes, techos ni puertas
- Gráficos más suaves: personajes redondeados con esqueleto, sombras, niebla, texturas de suelo, techos a dos aguas
- Paredes finas entre casillas, como en el original
- 5 tipos de vivienda (4 casas y una cabaña) con varias habitaciones, girados hacia la calle
- 3 edificios raros: estación de bomberos, comisaría y hospital (en torno al 1,5 % de los edificios)
- Puertas que se abren y cierran, ventanas que se abren y por las que se puede saltar, vallas que se saltan
- Interruptor de luz en cada habitación y lámparas de techo que iluminan de verdad
- Farolas, aceras con bordillo, árboles y pinos grandes, arbustos
- 23 armas cuerpo a cuerpo repartidas por las casas según la habitación
- Combate: apuntar, golpes múltiples, críticos, derribos, empujón, pisotón, ataque al suelo, remate con cuchillo, desgaste y rotura de armas, resistencia
- Zombis que agarran, arañan, hacen laceraciones y muerden; los mordiscos infectan. Si te rodean cuatro, te derriban
- Los zombis golpean puertas hasta romperlas, rompen ventanas y trepan por ventanas y vallas

**Bloque 3.1: sigilo y objetivo**
- Agacharse: andas más despacio, no haces ruido al caminar y tus golpes y puertas suenan a la mitad
- De pie te ven a 14 m al instante; agachado solo a 6 m y tardan cerca de un segundo en notarte (de muy cerca, al momento)
- Caminando de pie te oyen solo a 2 m (a tu espalda); agachado, nada. Correr te levanta y se oye a 7 m
- Si un zombi ya te persigue, agacharte no lo despista: primero rompe su línea de visión
- Contorno amarillo en el zombi al que apuntas (en móvil, en el que tienes a tu alcance delante)

**Bloque 3.2: animaciones y armas**
- Animaciones más fluidas y rápidas: transiciones suaves entre poses, golpes que aceleran hasta el impacto, cadera y hombros que se balancean, respiración en reposo, cabeza que compensa el giro
- Agarre a una o dos manos: un arma corta a dos manos hace un 15 % más de daño; una larga con una mano hace un 25 % menos, es más lenta y solo golpea a un zombi
- Armas largas: máximo 2, una en las manos y otra a la espalda (se ve en el personaje). Armas cortas: en los bolsillos, sin límite
- Soltar el arma de las manos

**Bloque 3.3: controles y más**
- HUD al estilo de los shooters de móvil: vida (línea blanca) y armas abajo al centro, joystick fijo con bloqueo de carrera, botones con iconos, botón contextual Abrir/Cerrar/Encender/Coger, Empujar junto a Atacar
- Pecho a tierra: te arrastras despacio, no haces ruido y solo te ven a 3,5 m (y tardan más en notarte). Tumbado no puedes atacar y te muerden con más facilidad
- Movimiento omnidireccional: correr y caminar en cualquier dirección con inercia; al apuntar, el torso mira al frente y la cadera gira hacia donde vas (también hacia atrás)
- Tras un empujón el zombi tarda 2 segundos más en levantarse
- Remate en el suelo: al golpear a un zombi caído, el personaje se acerca, se arrodilla y golpea, con plano de cine
- Agarre a dos manos con la mano izquierda realmente sobre el mango
- El metal pega un 12 % más; la madera un 10 % menos
- Muchos menos zombis: el 12 % de los chunks tiene una horda como antes; el resto, muy pocos. Muchos aparecen dentro de las casas y no salen de su habitación hasta oír un ruido o verte
- Ventanas: se abren y se cierran con Abrir; se salta por ellas con Saltar

**Bloque 3.4: esqueleto nuevo**
- 22 huesos (antes 17): columna en tres tramos, clavículas y dedos del pie. Sin dedos de la mano ni cara
- Piel suavizada: codos, rodillas, hombros, cadera y cintura se doblan repartidos entre dos huesos, sin cortes
- Las animaciones usan los huesos nuevos: la espalda se curva por tramos, los hombros acompañan al estirar, empujar y apuntar, y el pie rueda al pisar
- Nombres de huesos fáciles de emparejar con esqueletos estándar (por ejemplo Mixamo) si algún día se usan modelos externos

**Bloque 3.5: cámara, movimiento y combate de supervivencia moderna**
- Cámara más cerca y al hombro, con el personaje a la izquierda del encuadre (inspirada en el vídeo de referencia, sin copiar)
- Caminar hacia atrás sin darse la vuelta: el personaje retrocede mirando al frente; corriendo sí gira
- Agachado más bajo y natural, carrera con el torso inclinado
- Más polígonos: el jugador pasa a unos 6800 triángulos (pecho, omóplatos, orejas, cejas, manos con pulgar, suelas, mochila con saco de dormir) y los zombis a unos 7300 de cerca; de lejos usan una malla de unos 3300 para no perder fluidez
- Infectados con hongos: unos tienen bultos en la cabeza, el cuello y los hombros, y algunos una placa de hongo que les tapa media cara. Sufren espasmos (sacudidas secas de cabeza y hombros)
- Combo de 3 golpes: pulsa atacar otra vez durante un golpe. Con armas largas a dos manos: golpe, revés y un golpe fuerte por encima de la cabeza; con cuchillos: puñalada, tajo y puñalada
- El tercer golpe pega un 25 % más y derriba más, pero gasta más resistencia
- Paso adelante al golpear si el zombi está algo lejos
- Esquivar (R, RB o botón Esquivar): un paso rápido de 1,6 m hacia donde muevas el joystick (sin dirección, hacia atrás). Si esquivas justo cuando un zombi te agarra, falla y se queda vendido 1,4 s: el contraataque pega más y derriba más
- Los zombis avisan más antes de agarrar (casi un segundo con los brazos estirados), para que se pueda leer y esquivar
- Golpes con peso: un instante de cámara lenta al acertar y una pequeña sacudida de cámara; el zombi se dobla hacia el lado del golpe
- **Editar botones** (en el menú y en la pausa, solo en móvil): arrastra cualquier botón, el joystick o el panel de vida y armas; con − y + cambias el tamaño del elegido. Se guarda en el teléfono; "Restablecer" vuelve a la disposición original

**Bloque 3.6: armas de fuego, arco y agarre por la espalda**
- 4 armas nuevas, imitadas (sin copiar) de los vídeos de referencia: pistola semiautomática, escopeta de corredera, rifle de cerrojo con mira telescópica y arco
- Munición que se encuentra en las casas: balas de 9 mm, cartuchos, balas de rifle y flechas; y un silenciador para la pistola (V lo pone y lo quita; aguanta 20 disparos)
- Se dispara apuntando: la cámara se acerca al hombro y aparece una retícula que se abre al moverte y al disparar y se cierra si te quedas quieto. Sin apuntar, atacar da un culatazo
- Animaciones: pistola baja a un lado al caminar y a dos manos al apuntar; escopeta y rifle cruzados delante del cuerpo y con la culata al hombro al apuntar; retroceso, corredera de la escopeta, cerrojo del rifle, recarga de la pistola (cargador y corredera), de la escopeta cartucho a cartucho y del rifle bala a bala; el arco se tensa hasta la cara y la mano va al carcaj por la siguiente flecha. Las manos siguen al arma de verdad (IK en los dos brazos) y el torso sigue la mirada arriba y abajo
- Disparo a la cabeza: triple de daño. A las piernas: derriba más. La escopeta suelta 7 perdigones y pierde fuerza a partir de 6 m. El rifle mata casi siempre de un tiro
- Las balas las paran paredes y puertas cerradas. Fogonazo con luz, estela de la bala, sangre y polvo al impactar, sacudida de cámara y la mira sube un poco con cada disparo
- Los disparos se oyen lejos (pistola 30 m, escopeta 38 m, rifle 45 m) y atraen a los zombis. El arco y la pistola con silenciador casi no hacen ruido
- Las flechas vuelan con caída; muchas se recuperan del suelo o del cadáver
- Mira telescópica del rifle: al apuntar, zoom fuerte con visor
- Recarga con R (o empujar mientras apuntas en el mando). Con escopeta y rifle puedes disparar a mitad de recarga. Si pides recargar durante la corredera, recarga al terminar
- Agarre por la espalda: acércate por detrás a un zombi que no te ha visto y pulsa Empujar (el botón cambia a "Agarrar" y se marca en amarillo). Con un cuchillo encima: tres puñaladas al cuello. Sin cuchillo: lo estrangulas (más lento)
- Botón Recargar en móvil (también se puede mover con el editor) y munición encima de las armas
- Cambio de teclas: esquivar pasa a la F; la R es recargar

**Bloque 4: casas de dos pisos, muebles, tiendas y corredores**
- 3 modelos nuevos de casa de dos pisos, repartidos al azar: escalera de verdad (se sube y se baja andando), dormitorios, baño y estudio arriba, barandilla en el hueco de la escalera y ventanas en las dos plantas. Los zombis también suben y bajan, y los ruidos se oyen peor de una planta a otra
- Muebles en todas las casas y edificios: camas, mesitas, cómodas, armarios, sofás, mesas, cocina completa, nevera, baño, estanterías, bancos de trabajo, escritorios, archivadores, taquillas... Bloquean el paso y la cámara los tiene en cuenta
- Registrar: acércate a un mueble con cajones o puertas y pulsa Registrar (E). El personaje rebusca (agachado si es bajo) y encuentras lo que haya: la munición va directa a la mochila y las armas quedan delante para cogerlas. Casi todo el botín está ahora dentro de los muebles
- Comisaría: en la oficina hay un armero con escopeta de corredera y pistola siempre, y un 12 % de rifle (más munición)
- Casas de dos pisos: algo más de probabilidad de encontrar una pistola
- Tiendas de comida (todavía sin comida): escaparate, toldo a rayas, cartel con nombre, góndolas, neveras, mostrador con caja (a veces con una pistola debajo) y almacén
- Edificios especiales que se reconocen de lejos: cartel de BOMBEROS con portones abiertos, dos camiones de bomberos viejos dentro (ruedas pinchadas, óxido) y una torre; POLICÍA con franja azul, mástil y coche patrulla aparcado (se puede registrar el maletero); HOSPITAL con marquesina, cruz roja en el tejado y ambulancia
- Camiones de bomberos: tienen un cofre en el lateral con un hacha de bombero
- Ataque en carrera (como en el vídeo de referencia): corriendo, atacar hace que el personaje se lance con el arma arriba y descargue el golpe al llegar. Hace más daño y casi siempre derriba; con cuchillo se clava en la cabeza; sin arma es un placaje
- Agarrar por la espalda ahora va en el botón de Atacar (que se ilumina y pone "Agarrar")
- Corredores: uno de cada cuatro zombis es agresivo. Ve más lejos, te nota antes, se para a chillar al verte (y avisa a los de alrededor), corre casi como tú, encorvado y agitando los brazos, y se abalanza para agarrarte. Tienen algo menos de vida. El resto siguen siendo lentos
- Esqueleto con 24 huesos: un hueso para los dedos de cada mano, que se cierran sobre el arma, se abren al empujar o rebuscar y hacen garras en los zombis

**Bloque 5: menú de botín, rendimiento y vegetación**
- Menú de botín al estilo de los shooters de móvil: al registrar un mueble se abre un panel con lo que hay dentro, en tarjetas de dos columnas con su icono (sacado del modelo 3D), nombre y cantidad. Toca una para cogerla o "Coger todo". Si ya llevas dos armas largas, la que tenías se queda dentro del mueble (cambio). Se cierra con la X, con E/Esc o al alejarte
- Lo que registras se queda registrado: después el mueble pone "Abrir (n)" y se abre al momento; vacío ya no sale. Al salir de una casa y volver, el botín sigue igual (los muebles y lo que tienen dentro son datos del mundo; solo se ocultan sus modelos)
- En el suelo solo se ven las armas de fuego largas (escopeta, rifle, arco) y las flechas disparadas. Las armas cuerpo a cuerpo, la pistola y la munición se encuentran dentro de muebles. Lo que sueltas (G) que no sea un arma de fuego larga queda en un "montón" que se abre con el mismo menú
- El hacha de bombero solo está en los cofres de los camiones de bomberos. La palanca inicial está dentro de un mueble de la sala
- Fuera la mecánica de una o dos manos y el límite de las armas cortas: con dos largas a la espalda puedes seguir usando las cortas. V (LB) ahora es el accesorio: silenciador en la pistola y mira del rifle
- Rifle: el primer toque de Apuntar apunta normal; el segundo pone la mira telescópica (en PC, rueda o V apuntando)
- Arco: postura de tiro nueva. Cadera y torso de perfil, brazo izquierdo estirado hacia el blanco, cuerda hasta la barbilla y codo derecho atrás a la altura del hombro
- Las luces de las habitaciones salen encendidas o apagadas al azar (fuera los interruptores, de momento)
- Calidad gráfica en el menú de inicio y en la pausa: Auto, Baja, Media y Alta (se guarda en el teléfono). Auto empieza en Media en móvil y Alta en PC y baja sola si el juego va por debajo de ~24 fps. Opción "Limitar a 30 fps"
- Optimización: las zonas nuevas se construyen por partes, unos milisegundos por fotograma (sin tirones); muebles y tabiques no proyectan sombra y solo se dibujan si estás dentro de la casa o cerca; menos luces a la vez en calidades bajas; zombis con 3 niveles de detalle, sin sombra a partir de cierta distancia y animados cada 2 o 3 fotogramas cuando están lejos. En la casa inicial se pasa de unos 535 000 a unos 225 000 triángulos y de 185 a 105 llamadas de dibujo
- `?debug` ampliado: fps, llamadas de dibujo, triángulos y milisegundos por fotograma de lógica, zombis, mundo y dibujo
- Vegetación nueva: árboles con tronco y ramas en 3D y hojas en láminas con transparencia; pinos con pisos de ramas; arbustos de láminas cruzadas; todo se mece con el viento. De lejos cada árbol pasa a ser una sola lámina que mira a la cámara
- Hierba alta al estilo PUBG Mobile, en manchas por el césped y sobre todo fuera del pueblo. Se encoge a lo lejos (20 a 30 m según la calidad) y su densidad depende de la calidad
- Esconderse en la hierba alta: tumbado dentro, los zombis solo te ven casi encima; agachado, mucho más cerca de lo normal; de pie no te tapa. Moverte por ella hace un leve roce. El HUD muestra "Oculto en la hierba"

## Controles

| Acción | Teclado y ratón | Móvil | Mando |
|---|---|---|---|
| Mover (en cualquier dirección) | WASD | Joystick fijo a la izquierda | Stick izquierdo |
| Mirar | Ratón (clic para capturarlo) | Arrastrar a la derecha (también desde Atacar y Empujar) | Stick derecho |
| Correr | Shift | Arrastra el joystick hasta Correr (se queda corriendo) o toca Correr | L3 |
| Apuntar | Mantener clic derecho | Botón de mira (activa y desactiva) | LT |
| Mira telescópica del rifle | Apuntando: rueda o V | Toca Apuntar otra vez | Apuntando: LB |
| Atacar | Clic izquierdo | Botón grande | RT |
| Empujar / pisotear | Espacio | Empujar | X |
| Agarrar por la espalda (zombi desprevenido) | Clic izquierdo | Agarrar (sale en Atacar) | RT |
| Ataque en carrera | Correr + clic izquierdo | Correr + Atacar | L3 + RT |
| Registrar o abrir un mueble / montón | E (se abre el menú de botín) | Botón Registrar / Abrir | A |
| Coger del menú de botín | Clic en la tarjeta · "Coger todo" | Toca la tarjeta | — |
| Cerrar el menú de botín | X, E o Esc (o alejarte) | X (o alejarte) | A |
| Esquivar | F | Esquivar | RB |
| Disparar (armas de fuego y arco) | Apuntar + clic izquierdo | Mira + Atacar | LT + RT |
| Recargar | R | Recargar | X apuntando |
| Poner o quitar el silenciador | V | Toca la munición del recuadro | LB |
| Combo | Clic izquierdo otra vez durante el golpe | Atacar otra vez | RT otra vez |
| Abrir, cerrar, coger | E | Botón con la puerta (aparece al acercarte) | A |
| Saltar (vallas y ventanas abiertas) | X | Saltar | — |
| Agacharse | C | Agacharse | R3 |
| Pecho a tierra | Z | Pecho a tierra | B |
| Armas largas 1 y 2 / cortas | 1, 2, 3 · Q o rueda pasa por todas | Toca un recuadro (si ya la tienes, la guardas) | Y |
| Soltar arma | G | Mantén pulsado el recuadro | Select |
| Pausa | Esc o P | Engranaje | Start |

La mochila (abajo a la izquierda en móvil) todavía no tiene función. Para cambiar la posición o el tamaño de los botones en móvil: "Editar botones" en el menú o en la pausa.

## Armas

Contundentes largas: bate, bate con clavos, palo de golf, mazo, pala, tabla, tabla con clavos.
Contundentes cortas: palanca, martillo, llave inglesa, sartén, tubo de plomo, rodillo, porra policial.
Hachas: hacha de bombero, hacha de mano. Hojas largas: machete, katana.
Hojas cortas: cuchillo de cocina, cuchillo de caza, destornillador, cuchilla de carnicero. Lanza improvisada.
De fuego: pistola semiautomática (corta, va al bolsillo), escopeta de corredera, rifle de cerrojo y arco (largas, a la espalda).

Dónde buscar (casi todo dentro de muebles): pistolas y munición de 9 mm en mesitas, escritorios, mostradores y comisarías; escopetas en comisarías y maleteros de patrulla; rifles, arcos y flechas sobre todo en cabañas y garajes; el hacha de bombero, en los cofres de los camiones de bomberos; silenciadores, muy raros, en comisarías y garajes. En el suelo solo aparecen, rara vez, armas de fuego largas.

Armas largas (bates, palos, mazo, pala, tablas, palanca, hacha de bombero, katana, lanza, escopeta, rifle, arco): máximo 2, una en las manos y otra a la espalda (se ven las dos). Si coges una tercera, cambias la que tengas en las manos. Armas cortas: en los bolsillos, sin límite, y se pueden usar aunque lleves dos largas. Sin arma solo puedes empujar y pisotear.

## Cómo probarlo

Abre `index.html` en el navegador (necesita conexión para cargar Three.js desde el CDN).

Opciones en la dirección (se pueden combinar con `&`):
- `?debug` muestra fotogramas, llamadas de dibujo, triángulos, chunks, zombis, la semilla y los milisegundos de cada parte (lógica, zombis, mundo, dibujo)
- `?seed=123` repite el mismo mundo
- `?armas` pone las armas de fuego largas junto al inicio y todo lo demás (cuerpo a cuerpo, pistola, munición, silenciador) en un montón
- `?calidad=baja` (o `media`, `alta`) fuerza esa calidad sin guardarla

## Publicar en GitHub Pages

1. Sube todos los archivos a la raíz del repositorio, con la carpeta `src`.
2. En el repositorio: Settings, Pages, Source "Deploy from a branch", rama `main`, carpeta `/ (root)`.
3. En uno o dos minutos estará en `https://TU_USUARIO.github.io/NOMBRE_DEL_REPO/`.

## Estructura

```
index.html        página, HUD y controles táctiles
style.css         estilos
src/
  util.js         ayudas (aleatorio con semilla, ángulos, colores)
  quality.js      calidad gráfica (Baja, Media, Alta, Auto) y límite de 30 fps
  mesher.js       une muchas piezas en una sola malla
  buildings.js    plantillas de edificios por habitaciones
  weapons.js      las 23 armas y qué aparece en cada habitación
  furniture.js    muebles y vehículos: colocación, modelos y lo que hay dentro
  world.js        chunks infinitos, plantas, escaleras, paredes, colisiones, línea de vista, rutas
  vegetation.js   árboles, pinos, arbustos y hierba alta (láminas con transparencia y viento)
  worldview.js    modelos 3D del mundo por etapas, puertas, ventanas, luces, interiores
  models.js       personajes con esqueleto, animaciones y modelos de armas
  input.js        teclado, ratón, táctil y mando
  camera.js       cámara en tercera persona
  player.js       jugador: movimiento, resistencia, heridas, armas
  zombie.js       zombi: sentidos, persecución, puertas, golpes recibidos
  population.js   zombis por chunk: crear, dormir y despertar
  combat.js       combate cuerpo a cuerpo, agarre por la espalda
  guns.js         armas de fuego y arco: disparos, flechas, munición, efectos
  interact.js     puertas, ventanas, vallas, muebles, montones y armas del suelo
  loot.js         menú de botín (tarjetas con iconos sacados de los modelos)
  hudedit.js      editor de botones (mover y cambiar tamaño, guardado en el teléfono)
  main.js         bucle principal, luces, HUD
```

## Ajustes rápidos

- Dificultad de los zombis: constantes al inicio de `src/zombie.js` (vida, velocidad, visión)
- Armas: tabla al inicio de `src/weapons.js` (daño, alcance, velocidad, durabilidad)
- Armas de fuego: tabla de `src/weapons.js` (daño, cargador, cadencia, recarga, dispersión, ruido); retroceso de la mira y sacudida en `KICK` y `SHAKE` de `src/guns.js`; cuánta munición trae cada caja en `AMMO`
- Qué hay dentro de cada mueble: tabla `C` en `src/furniture.js` (por ejemplo `armero`, `mesita`, `mostrador`, `cofre_camion`); qué muebles lleva cada habitación: `SETS`
- Botín extra por habitación: tabla `LOOT` en `src/weapons.js` (las armas de fuego largas van al suelo; lo demás, a un mueble de esa habitación)
- Calidades: tabla `PRESETS` en `src/quality.js` (resolución, sombras, niebla, luces, distancia de interiores, hierba, árboles lejanos, detalle de zombis, milisegundos de carga)
- Hierba alta: dónde sale, en `generateChunk` de `src/world.js` (busca `c.tall`); cuánto esconde, `grass` en `src/zombie.js`; aspecto en `src/vegetation.js`
- Corredores: `RUNNER_CHANCE` (proporción) y `RUNNER` (velocidad, vista, chillido) en `src/zombie.js`
- Cuántas casas de dos pisos y tiendas salen: el reparto en `generateChunk` de `src/world.js` (busca `B.SHOPS`)
- Esquiva: `DODGE_DIST` en `src/player.js`; cuánto tarda el zombi en agarrar: `WINDUP` en `src/zombie.js`
- Parón al golpear: `hitStop` en `resolveSwing` de `src/combat.js` (pon 0 para quitarlo); sacudida de cámara: `shake` en `src/camera.js`
- Ritmo de los ataques: `ANIM` en `src/combat.js`; suavidad de las animaciones: números de `blend(...)` en `src/models.js`
- Distancia a la que te oyen correr o caminar: `NOISE_RUN` y `NOISE_WALK` en `src/player.js` (pon `NOISE_WALK = 0` para que caminar de pie sea silencioso)
- Sigilo: `CROUCH_SIGHT`, `PRONE_SIGHT` y `NOTICE_TIME` en `src/zombie.js`
- Cantidad de zombis y probabilidad de horda: `HORDE_CHANCE` y la sección de zombis en `src/world.js`
- Inercia del movimiento: `ACCEL` y `DECEL` en `src/player.js`
- Distancia de la cámara: constantes al inicio de `src/camera.js`
- Niebla: `fog` de cada calidad en `src/quality.js`
- Probabilidad de edificios raros: `specialQ` en `src/world.js`

## Plan de bloques

1. Base y zombis lentos (hecho)
2. Mundo infinito por chunks (hecho)
3. Tercera persona, casas con interiores y combate (hecho)
4. Casas de dos pisos, muebles y tiendas (hecho)
5. Menú de botín, rendimiento y vegetación (hecho)
6. Supervivencia: hambre, sed, cansancio, vendajes y curación
7. Inventario completo y saqueo
8. Día y noche, clima
9. Pulido: guardado, sonido, PWA

## Licencia

Añade una licencia al repositorio (por ejemplo MIT) antes de publicarlo. Three.js se carga desde un CDN y tiene su propia licencia (MIT).
