# Little Moments — Memory Game

Aplicación web interactiva de juego de memoria visual con estética cozy, minimalista y editorial, diseñada prioritariamente para computadoras de escritorio (con adaptación completa a tablets y móviles). Permite explorar tres colecciones independientes: **Taylor's Version**, **Entre páginas** y **Matcha Moments**, con audio ambiental progresivo, cartas estilo polaroid 3D, temporizador con pausa, puntuación basada en precisión y persistencia local de récords.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> Decisiones de diseño y mecánicas confirmadas durante la fase de clarificación interactiva:
> - **Flujo de Colecciones:** Al seleccionar una colección, el usuario navega a la vista de exploración detallada (álbumes o libros individuales y modo general de la colección) antes de configurar la dificultad.
> - **Ambiente Sonoro:** Se incluye música ambiental lo-fi suave y relajante con fade-in progresivo (1.5–3s), volumen predeterminado al 20%, y controles deslizantes independientes para música y efectos táctiles.
> - **Acabado de Cartas:** Formato polaroid elegante con textura ligera, rotación 3D natural sobre el eje Y (350–450ms) y micro-resplandor sutil al emparejar.

---

### 1. Overview & Core Concept

- **Propósito:** Ofrecer una experiencia digital de relajación ("cozy memory game") donde el usuario ejercita su agilidad visual y memoria conectando con elementos culturales significativos (álbumes musicales con canciones reales, literatura feminista y el ritual del matcha).
- **Enfoque de Plataforma:** **Desktop-First** con un canvas espacioso (1366px, 1440px y 1920px), distribución en 3 paneles equilibrados en partida y adaptación ergonómica a pantallas táctiles.
- **Valor Diferencial:** Pantallas completamente interactivas y conectadas (Inicio, Galería de Colecciones, Selector de Álbum/Libro, Configuración de Partida, Tablero Central y Modal de Resultados con datos verificados y reproductor musical con fade-in).

---

### 2. User Experience & Visual Design

#### Navegación y Pantallas Principales

1. **Pantalla A — Inicio (Welcome Hub):**
   - *Barra superior*: Marca "Little Moments", enlaces a Colecciones, Mi Progreso, Configuración y control global de audio.
   - *Hero Editorial*: Título en fuente serif *"Un pequeño momento para recordar"*, subtítulo acogedor, botón primario *"Explorar colecciones"* y composición fotográfica polaroid flotante.
   - *Grid de Colecciones Principales*: 3 tarjetas grandes con hover sutil (+4px de elevación), indicador de progreso real (0% inicial) y botón *"Jugar"*.
   - *Banda de Métricas Globales*: Mejor puntuación, partidas completadas, precisión media y colecciones descubiertas (datos reales desde `localStorage`).

2. **Pantalla B — Colecciones & Detalles:**
   - Pestañas generosas y claramente separadas:
     - **Taylor's Version:** Catálogo de 11 álbumes/eras (Taylor Swift, Fearless, Speak Now, Red, 1989, Reputation, Lover, Folklore, Evermore, Midnights, TTPD) con portada, año, canción representativa con audio real, récord personal y retos por álbum o colección completa.
     - **Entre páginas:** Biblioteca de literatura escrita por mujeres y ensayos feministas (*Una habitación propia*, *El segundo sexo*, *El feminismo es para todo el mundo*, *Wildflowers & Resistance*, etc.) con citas verificadas.
     - **Matcha Moments:** Ritual ceremonial, batidor chasen, chawan artesanal, latte botánico, postres y notas de cata.

3. **Pantalla C — Configuración de Partida:**
   - Selección de dificultad: **Fácil (6 parejas / 4x3)**, **Medio (8 parejas / 4x4)** y **Difícil (12 parejas / 6x4)**.
   - Vista previa del set de cartas, tiempo objetivo y bonos aplicables.

4. **Pantalla D — Gameplay de Escritorio (Arquitectura en 3 Paneles):**
   - **Panel Izquierdo (300px):** Portada y contexto de la colección, citas/canción activa, barra de progreso de la partida.
   - **Zona Central (Dominante):** Tablero CSS Grid perfectamente alineado, cartas polaroid con proporción cuadrada/3:4, animación 3D de volteo y bloqueo anti-spam de clics.
   - **Panel Derecho (260px):** HUD con números tabulares (Tiempo `00:00`, Intentos, Parejas, Puntos acumulados), botón de Pausa (con blur de protección anti-trampa), Reiniciar y Volver.
   - *En tablet y móvil:* Reorganización fluida en barra superior compacta y tablero accesible sin desbordamientos.

5. **Pantalla E — Resultados & Celebración:**
   - Calificación de 1 a 3 estrellas según precisión y tiempo.
   - Desglose transparente: Puntos base (+100 por pareja), penalización (-10 por fallo) y bono por tiempo (hasta +300 pts).
   - En *Taylor's Version*: Tarjeta musical con reproductor de la canción oficial del álbum con fade-in desde 0.
   - En *Libros* y *Matcha*: Datos curiosos y extractos literarios verificados.
   - Botones para *"Volver a jugar"*, *"Cambiar dificultad"* y *"Explorar siguiente colección"*.

#### Sistema de Diseño & Tokens

| Token | Valor Hex | Uso en la Interfaz |
|---|---|---|
| `--bg-main` | `#FAF8F5` | Fondo principal cálido y relajante |
| `--lavender-soft` | `#E8DDF3` | Superficies de Taylor's Version y acentos |
| `--rose-pastel` | `#F4DDE5` | Detalles románticos, badges y alertas |
| `--matcha-green` | `#DCE8D5` | Fondos de la sección Matcha y estados de éxito |
| `--cream-warm` | `#FFF3E6` | Contenedores de libros y tarjetas polaroid |
| `--text-primary` | `#38343B` | Tipografía principal (alto contraste WCAG AA) |
| `--text-secondary`| `#77717D` | Metadatos y etiquetas secundarias |
| `--accent-lavender`| `#987CB0` | Botones de acción, indicadores y bordes activos |

- **Tipografía:** `DM Serif Display` / `Fraunces` para títulos expresivos y `Plus Jakarta Sans` / `DM Sans` para interfaces y números tabulares (`font-mono tabular-nums`).
- **Radios y Sombras:** `rounded-2xl` (16px) a `rounded-3xl` (24px) con sombras difusas ultra suaves (`shadow-[0_8px_30px_rgb(0,0,0,0.04)]`).

---

### 3. Key Product Decisions & Trade-Offs

- **Desktop-First vs Mobile-First:** Se diseña primordialmente para pantallas amplias (1366px+) garantizando que el tablero, panel informativo y panel de métricas coexistan simultáneamente sin scroll forzado. En pantallas pequeñas se apilan de forma ordenada con navegación por gestos y botones grandes (mínimo 44px).
- **Música con Fade-In Progresivo:** Previene el inicio brusco o a alto volumen. Toda pista arranca en volumen 0 y realiza una rampa lineal/exponencial de 2 segundos hasta el 20%. Los controles de volumen de música y efectos están desacoplados.
- **Audio Oficial Verificado:** Uso de transmisiones oficiales de vista previa (30 segundos en alta calidad) suministradas por CDN oficial para las pistas de Taylor Swift, con respaldo algorítmico Web Audio en caso de falta de conexión.
- **Persistencia Local Robusta:** Historial y preferencias almacenadas en `localStorage` con validación de esquema, permitiendo futura sincronización a la nube sin cambios de arquitectura.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        LITTLE MOMENTS ROOT APP                         │
│  (State: activeScreen, activeCollection, selectedAlbum, gameSettings)  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┼───────────────────────────────┐
    ▼                               ▼                               ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│   PANTALLA A:    │      │   PANTALLA B:    │      │   PANTALLAS C-E: │
│   Inicio / Hero  │      │   Colecciones    │      │   Setup / Game / │
│   & Progreso     │      │   & Catálogos    │      │   Resultados     │
└──────────────────┘      └──────────────────┘      └─────────┬────────┘
                                                              │
                                            ┌─────────────────┴─────────────────┐
                                            ▼                                   ▼
                                 ┌──────────────────────┐            ┌──────────────────────┐
                                 │ Panel Lateral (Meta) │            │ Tablero Central Grid │
                                 │ & Panel HUD Métricas │            │ & Cartas Polaroid 3D │
                                 └──────────────────────┘            └──────────────────────┘
                                            │
                                            ▼
                                 ┌──────────────────────────────────────┐
                                 │ Audio Controller (Music & SFX Engine)│
                                 │ - Volume Fade-In (0 -> 20%)          │
                                 │ - Independent BGM & FX channels      │
                                 │ - Real Audio Previews + Synth Backup │
                                 └──────────────────────────────────────┘
```

#### Estructura de Datos Modulares

- `CollectionId`: `'taylor' | 'books' | 'matcha'`
- `AlbumItem`: Datos de cada era de Taylor Swift con portada, año, canción representativa y `audioUrl`.
- `BookItem`: Títulos y autoras verificadas de literatura feminista.
- `MatchaItem`: Elementos del ritual, preparación y repostería.
- `GameState`: `moves`, `timeSeconds`, `matchesCount`, `score`, `isPaused`, `accuracy`, `stars`.
- `UserProgress`: Guardado en `localStorage` con partidas completadas por colección, mejor puntaje y preferencias de audio.
