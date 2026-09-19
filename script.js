document.addEventListener("DOMContentLoaded", () => {
    document.body.style.opacity = 0;

    setTimeout(() => {
        document.body.style.transition = "opacity 1s";
        document.body.style.opacity = 1;
    }, 100);
});


// ==========================================
// MENÚ
// ==========================================

function toggleMenu() {
    document.getElementById("menu").classList.toggle("show");
}


// Cerrar si haces click fuera
window.onclick = function(e) {
    if (!e.target.matches('.dropdown-btn')) {
        const menu = document.getElementById("menu");

        if (menu && menu.classList.contains('show')) {
            menu.classList.remove('show');
        }
    }
};


// ==========================================
// RESEÑAS DE GOOGLE
// ==========================================

// Durante las pruebas locales
//const REVIEWS_API_URL = "http://localhost:8080/google/reviews";
const REVIEWS_API_URL =
    "https://lessaterapias-api-374422464942.europe-southwest1.run.app/google/reviews";


// Número máximo de caracteres que mostraremos inicialmente
const MAX_REVIEW_LENGTH = 300;


async function cargarResenas() {

    const grid = document.getElementById("reviews-grid");
    const loading = document.getElementById("reviews-loading");
    const error = document.getElementById("reviews-error");
    const reviewsPrev = document.getElementById("reviews-prev");
    const reviewsNext = document.getElementById("reviews-next");

    if (!grid) return;

    try {

        const respuesta = await fetch(REVIEWS_API_URL);

        if (!respuesta.ok) {
            throw new Error(`Error HTTP ${respuesta.status}`);
        }

        const resenas = await respuesta.json();

        loading.hidden = true;

        if (!Array.isArray(resenas) || resenas.length === 0) {
            error.hidden = false;
            return;
        }


        // =====================================================
        // PREPARAMOS EL CONTENEDOR
        // =====================================================

        grid.innerHTML = "";

        grid.style.display = "block";
        grid.style.overflow = "hidden";
        grid.style.width = "100%";


        // Carril que se moverá
        const track = document.createElement("div");

        track.className = "reviews-track";

        track.style.display = "flex";
        track.style.flexWrap = "nowrap";
        track.style.gap = "20px";
        track.style.width = "max-content";
        track.style.willChange = "transform";
        track.style.transition =
            "transform 1s cubic-bezier(0.65, 0, 0.35, 1)";


        grid.appendChild(track);


        // =====================================================
        // CUÁNTAS TARJETAS MOSTRAMOS
        // =====================================================

        function obtenerTarjetasVisibles() {

            const ancho = window.innerWidth;

            // Móvil vertical
            if (ancho <= 599) {
                return 1;
            }

            // Móvil horizontal
            if (ancho <= 899) {

                if (window.matchMedia("(orientation: landscape)").matches) {
                    return 2;
                }

                return 3;
            }

            // Tablet
            if (ancho <= 1199) {
                return 4;
            }

            // PC
            return 5;
        }


        let tarjetasVisibles = obtenerTarjetasVisibles();
        let indiceActual = tarjetasVisibles;
        let moviendo = false;


        // =====================================================
        // CREAR TARJETA
        // =====================================================

        function crearTarjeta(resena) {

            const estrellas =
                "★".repeat(Number(resena.rating) || 0);

            const fecha =
                formatearFecha(resena.date);

            const textoCompleto =
                resena.text || "";

            const esLarga =
                textoCompleto.length > MAX_REVIEW_LENGTH;

            const textoCorto = esLarga
                ? textoCompleto
                    .substring(0, MAX_REVIEW_LENGTH)
                    .trim() + "..."
                : textoCompleto;


            return `
                <article class="review-card">

                    <div class="review-header">

                        ${
                            resena.photo
                            ? `
                                <img
                                    class="review-photo"
                                    src="${escaparHTML(resena.photo)}"
                                    alt="Foto de ${escaparHTML(resena.name || "cliente")}"
                                    loading="lazy"
                                >
                            `
                            : ""
                        }

                        <div>

                            <h3 class="review-name">
                                ${escaparHTML(resena.name || "Cliente")}
                            </h3>

                            <div
                                class="review-stars"
                                aria-label="${resena.rating} de 5 estrellas"
                            >
                                ${estrellas}
                            </div>

                        </div>

                        <time class="review-date">
                            ${fecha}
                        </time>

                    </div>


                    <div class="review-content">

                        <p class="review-text">
                            ${escaparHTML(textoCorto)}
                        </p>

                        ${
                            esLarga
                            ? `
                                <button
                                    type="button"
                                    class="review-more-btn"
                                    data-review-id="${resena.id}"
                                    data-expanded="false"
                                >
                                    Leer más
                                </button>
                            `
                            : ""
                        }

                    </div>

                </article>
            `;
        }


        // =====================================================
        // CONSTRUIR EL CARRUSEL
        // =====================================================

        function construirCarrusel() {

            tarjetasVisibles = obtenerTarjetasVisibles();


            // Si hay pocas reseñas no necesitamos clones
            const necesitaClones =
                resenas.length > tarjetasVisibles;


            let lista;


            if (necesitaClones) {

                /*
                 * Ponemos copias al principio y al final.
                 *
                 * Ejemplo con 5 visibles:
                 *
                 * [8][9][10] [1][2][3][4][5][6][7][8][9][10] [1][2][3][4][5]
                 *
                 * Esto permite hacer el bucle de forma continua.
                 */

                const primeras =
                    resenas.slice(0, tarjetasVisibles);

                const ultimas =
                    resenas.slice(-tarjetasVisibles);

                lista = [
                    ...ultimas,
                    ...resenas,
                    ...primeras
                ];

                indiceActual = tarjetasVisibles;

            } else {

                lista = [...resenas];

                indiceActual = 0;
            }


            track.innerHTML =
                lista.map(crearTarjeta).join("");


            // =================================================
            // CALCULAR ANCHO DE CADA TARJETA
            // =================================================

            const anchoContenedor =
                grid.clientWidth;

            const gap = 20;

            const anchoTarjeta =
                (
                    anchoContenedor -
                    gap * (tarjetasVisibles - 1)
                ) / tarjetasVisibles;


            track.querySelectorAll(".review-card")
                .forEach(tarjeta => {

                    tarjeta.style.flex =
                        `0 0 ${anchoTarjeta}px`;

                });


            // =================================================
            // POSICIÓN INICIAL
            // =================================================

            const paso =
                anchoTarjeta + gap;


            track.style.transition = "none";

            track.style.transform =
                `translate3d(${-indiceActual * paso}px, 0, 0)`;


            // Activamos la transición después
            requestAnimationFrame(() => {

                track.style.transition =
                    "transform 1s cubic-bezier(0.65, 0, 0.35, 1)";

            });


            // Ocultar flechas si no hacen falta

            const mostrarFlechas =
                resenas.length > tarjetasVisibles;

            reviewsPrev.hidden = !mostrarFlechas;
            reviewsNext.hidden = !mostrarFlechas;
        }


        construirCarrusel();


        // =====================================================
        // MOVER CARRUSEL
        // =====================================================

        function moverCarrusel(direccion) {

            if (moviendo) return;

            if (resenas.length <= tarjetasVisibles) {
                return;
            }


            moviendo = true;

            indiceActual += direccion;


            const tarjeta =
                track.querySelector(".review-card");

            if (!tarjeta) {
                moviendo = false;
                return;
            }


            const gap = 20;

            const paso =
                tarjeta.getBoundingClientRect().width + gap;


            track.style.transition =
                "transform 1s cubic-bezier(0.65, 0, 0.35, 1)";


            track.style.transform =
                `translate3d(${-indiceActual * paso}px, 0, 0)`;
        }


        // =====================================================
        // CUANDO TERMINA EL MOVIMIENTO
        // =====================================================

        track.addEventListener("transitionend", event => {

            if (event.propertyName !== "transform") {
                return;
            }


            const cantidad =
                resenas.length;


            /*
             * Hemos llegado a las copias del final.
             * Saltamos SIN animación al principio real.
             */

            if (indiceActual >= tarjetasVisibles + cantidad) {

                indiceActual = tarjetasVisibles;

                const tarjeta =
                    track.querySelector(".review-card");

                const paso =
                    tarjeta.getBoundingClientRect().width + 20;


                track.style.transition = "none";

                track.style.transform =
                    `translate3d(${-indiceActual * paso}px, 0, 0)`;


                requestAnimationFrame(() => {

                    track.style.transition =
                        "transform 1s cubic-bezier(0.65, 0, 0.35, 1)";

                });
            }


            /*
             * Hemos llegado a las copias del principio.
             * Saltamos SIN animación al final real.
             */

            if (indiceActual <= 0) {

                indiceActual = cantidad;

                const tarjeta =
                    track.querySelector(".review-card");

                const paso =
                    tarjeta.getBoundingClientRect().width + 20;


                track.style.transition = "none";

                track.style.transform =
                    `translate3d(${-indiceActual * paso}px, 0, 0)`;


                requestAnimationFrame(() => {

                    track.style.transition =
                        "transform 1s cubic-bezier(0.65, 0, 0.35, 1)";

                });
            }


            moviendo = false;
        });


        // =====================================================
        // FLECHA DERECHA
        // =====================================================

        reviewsNext.addEventListener("click", () => {

            moverCarrusel(1);

        });


        // =====================================================
        // FLECHA IZQUIERDA
        // =====================================================

        reviewsPrev.addEventListener("click", () => {

            moverCarrusel(-1);

        });


        // =====================================================
        // LEER MÁS / LEER MENOS
        // =====================================================

        track.addEventListener("click", event => {

            const boton =
                event.target.closest(".review-more-btn");

            if (!boton) return;


            const reviewId =
                boton.dataset.reviewId;


            const resena =
                resenas.find(
                    item => item.id === reviewId
                );


            if (!resena) return;


            const tarjeta =
                boton.closest(".review-card");


            const texto =
                tarjeta.querySelector(".review-text");


            const estaExpandida =
                boton.dataset.expanded === "true";


            if (estaExpandida) {

                texto.textContent =
                    resena.text
                        .substring(0, MAX_REVIEW_LENGTH)
                        .trim() + "...";

                boton.textContent =
                    "Leer más";

                boton.dataset.expanded =
                    "false";

            } else {

                texto.textContent =
                    resena.text;

                boton.textContent =
                    "Leer menos";

                boton.dataset.expanded =
                    "true";
            }

        });


        // =====================================================
        // RESPONSIVE
        // =====================================================

        let resizeTimer;

        window.addEventListener("resize", () => {

            clearTimeout(resizeTimer);

            resizeTimer = setTimeout(() => {

                construirCarrusel();

            }, 200);

        });

    } catch (err) {

        console.error(
            "No se pudieron cargar las reseñas:",
            err
        );

        loading.hidden = true;
        error.hidden = false;
    }
}


// ==========================================
// FECHA
// ==========================================

function formatearFecha(fecha) {

    if (!fecha) return "";

    const date = new Date(fecha + "T00:00:00");

    if (Number.isNaN(date.getTime())) {
        return fecha;
    }

    return date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}



// ==========================================
// SEGURIDAD
// ==========================================

function escaparHTML(texto) {

    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}



// ==========================================
// CARGAR SECCIÓN DE RESEÑAS
// ==========================================

async function cargarSeccionResenas() {

    const contenedor = document.getElementById("reviews-container");

    if (!contenedor) return;

    try {

        const respuesta = await fetch("reviews.html");

        if (!respuesta.ok) {
            throw new Error(`Error HTTP ${respuesta.status}`);
        }

        const html = await respuesta.text();

        contenedor.innerHTML = html;

        // Ahora que reviews.html está dentro de la página,
        // cargamos las reseñas de Google.
        cargarResenas();

    } catch (error) {

        console.error(
            "No se pudo cargar la sección de reseñas:",
            error
        );

    }
}


document.addEventListener(
    "DOMContentLoaded",
    cargarSeccionResenas
);