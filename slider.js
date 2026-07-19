// ================================
// HERO SLIDER
// ================================

// Lista de diapositivas
const slides = [

    {
        imagen: "hero-banner.png",
        titulo: "Tu espacio de salud física y energética",
        texto: "Un lugar donde el cuidado del cuerpo, la energía y el bienestar se unen para ayudarte a recuperar tu equilibrio."
    },

    {
        imagen: "hero-osteo.png",
        titulo: "Osteopatía",
        texto: "Recupera la movilidad y reduce el dolor mediante un tratamiento manual personalizado."
    },

    {
        imagen: "masage.jpg",
        titulo: "Quiromasaje",
        texto: "Libera tensiones musculares y disfruta de una sensación de bienestar profundo."
    },

    {
        imagen: "hero-drenaje.png",
        titulo: "Drenaje Linfático",
        texto: "Favorece la circulación linfática y ayuda a eliminar líquidos y toxinas."
    },

    {
        imagen: "hero-reiki2.png",
        titulo: "Reiki",
        texto: "Recupera el equilibrio energético y alcanza un estado de relajación profunda."
    },

    {
        imagen: "hero-lnt.jpg",
        titulo: "La Nueva Terapia®",
        texto: "Una terapia integrativa que trabaja el equilibrio físico, emocional y energético."
    },

    {
        imagen: "hero-biodinamica.png",
        titulo: "Biodinámica Cráneo Sacral",
        texto: "Una terapia suave que acompaña al sistema nervioso hacia un estado de equilibrio."
    },

    {
        imagen: "hero-madero.png",
        titulo: "Madero terapia",
        texto: "la mejor manera de sentir tu piel y cuerpo rejuvenecidos de nuevo"
    }

];


//==============================
// VARIABLES
//==============================

let indice = 0;

const heroImg = document.getElementById("hero-img");
const heroTitle = document.getElementById("hero-title");
const heroText = document.getElementById("hero-text");


//==============================
// CARGAR SLIDE
//==============================

function mostrarSlide(numero){

    heroImg.src = slides[numero].imagen;

    heroTitle.textContent = slides[numero].titulo;

    heroText.textContent = slides[numero].texto;

}


//==============================
// SIGUIENTE
//==============================

function siguienteSlide(){

    indice++;

    if(indice >= slides.length){

        indice = 0;

    }

    mostrarSlide(indice);

}


//==============================
// ANTERIOR
//==============================

function anteriorSlide(){

    indice--;

    if(indice < 0){

        indice = slides.length - 1;

    }

    mostrarSlide(indice);

}


//==============================
// CAMBIO AUTOMÁTICO
//==============================

setInterval(siguienteSlide,6000);


//==============================
// INICIO
//==============================

mostrarSlide(indice);