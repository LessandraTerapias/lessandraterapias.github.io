/*=========================================================
=
=        HERO SLIDER v2.0
=        Lessandra Rodrigues
=
=========================================================*/


/*=========================================================
=
= CONFIGURACIÓN
=
=========================================================*/

const CONFIG = {

    // efecto:
    // slide
    // fade
    // cube
    // flip
    // coverflow
    // apple

    effect: "slide",

    duration: 800,

    autoplay: false,

    interval: 6000,

    swipe: true,

    mouse: true,

    keyboard: true,

    loop: true,

    preload: true

};



/*=========================================================
=
= DIAPOSITIVAS
=
=========================================================*/

const slides = [

    {

        imagen:"hero-banner.png",

        titulo:"Tu espacio de salud física y energética",

        texto:"Un lugar donde el cuidado del cuerpo, la energía y el bienestar se unen para ayudarte a recuperar tu equilibrio."

    },

    {

        imagen:"hero-osteo.png",

        titulo:"Osteopatía",

        texto:"Recupera la movilidad y reduce el dolor mediante un tratamiento manual personalizado."

    },

    {

        imagen:"masage.jpg",

        titulo:"Quiromasaje",

        texto:"Libera tensiones musculares y disfruta de una sensación de bienestar profundo."

    },

    {

        imagen:"hero-drenaje.png",

        titulo:"Drenaje Linfático",

        texto:"Favorece la circulación linfática y ayuda a eliminar líquidos y toxinas."

    },

    {

        imagen:"hero-reiki2.png",

        titulo:"Reiki",

        texto:"Recupera el equilibrio energético y alcanza un estado de relajación profunda."

    },

    {

        imagen:"hero-lnt.png",

        titulo:"La Nueva Terapia®",

        texto:"Una terapia integrativa que trabaja el equilibrio físico, emocional y energético."

    },

    {

        imagen:"hero-biodinamica.png",

        titulo:"Biodinámica Cráneo Sacral",

        texto:"Una terapia suave que acompaña al sistema nervioso hacia un estado de equilibrio."

    },

    {

        imagen:"hero-madero.png",

        titulo:"Maderoterapia",

        texto:"La mejor manera de sentir tu piel y cuerpo rejuvenecidos."

    }

];



/*=========================================================
=
= CLASE HERO SLIDER
=
=========================================================*/

class HeroSlider{

    constructor(slides,config){

        this.slides = slides;

        this.config = config;

        this.index = 0;

        this.timer = null;

        this.lock = false;

        this.touchStart = 0;

        this.touchEnd = 0;

        this.mouseDown = false;



        /*==========================
        =
        = ELEMENTOS HTML
        =
        ==========================*/

        this.hero = document.querySelector(".hero-banner");

        this.imgA = document.getElementById("hero-img-1");

        this.imgB = document.getElementById("hero-img-2");

        this.slideA = document.querySelector(".actual");

        this.slideB = document.querySelector(".siguiente");

        this.currentSlide = this.slideA;

        this.nextSlide = this.slideB;

        this.title = document.getElementById("hero-title");

        this.text = document.getElementById("hero-text");



        this.currentImage = this.imgA;

        this.nextImage = this.imgB;



        if(!this.hero){

            console.error("No existe .hero-banner");

            return;

        }



        this.preloadImages();

        this.load(0);

        this.registerEvents();



        if(this.config.autoplay){

            this.startAutoplay();

        }

    }



    /*======================================================
    =
    = CARGAR DIAPOSITIVA
    =
    ======================================================*/

    load(index){

        const slide = this.slides[index];

        this.currentImage.src = slide.imagen;

        this.title.textContent = slide.titulo;

        this.text.textContent = slide.texto;

    }



    /*======================================================
    =
    = PRECARGAR IMÁGENES
    =
    ======================================================*/

    preloadImages(){

        if(!this.config.preload) return;

        this.slides.forEach(slide=>{

            const img = new Image();

            img.src = slide.imagen;

        });

    }



    /*======================================================
    =
    = ÍNDICE SIGUIENTE
    =
    ======================================================*/

    getNextIndex(){

        let next = this.index + 1;

        if(next >= this.slides.length){

            if(this.config.loop){

                next = 0;

            }else{

                next = this.slides.length - 1;

            }

        }

        return next;

    }



    /*======================================================
    =
    = ÍNDICE ANTERIOR
    =
    ======================================================*/

    getPrevIndex(){

        let prev = this.index - 1;

        if(prev < 0){

            if(this.config.loop){

                prev = this.slides.length - 1;

            }else{

                prev = 0;

            }

        }

        return prev;

    }



    /*======================================================
    =
    = CAMBIAR CAPAS
    =
    ======================================================*/

    swapImages(){

    [this.currentImage, this.nextImage] =
    [this.nextImage, this.currentImage];

    [this.currentSlide, this.nextSlide] =
    [this.nextSlide, this.currentSlide];

    }



    /*======================================================
    =
    = AUTOPLAY
    =
    ======================================================*/

    startAutoplay(){

        this.stopAutoplay();

        this.timer = setInterval(()=>{

            this.next();

        },this.config.interval);

    }



    stopAutoplay(){

        clearInterval(this.timer);

    }



    /*======================================================
    =
    = MÉTODOS PÚBLICOS
    =
    ======================================================*/

    next(){

        if(this.lock) return;

        this.go(this.getNextIndex(),"next");

    }



    prev(){

        if(this.lock) return;

        this.go(this.getPrevIndex(),"prev");

    }



/*======================================================
=
= MOTOR PRINCIPAL
=
======================================================*/

go(index,direction){

    if(this.lock) return;

    this.lock = true;



    //--------------------------------------
    // diapositiva destino
    //--------------------------------------

    const slide = this.slides[index];



    //--------------------------------------
    // cargar imagen siguiente
    //--------------------------------------

    this.nextImage.src = slide.imagen;



    //--------------------------------------
    // elegir efecto
    //--------------------------------------

    switch(this.config.effect){

        case "slide":

            this.effectSlide(direction);

            break;

        case "fade":

            this.effectFade(direction);

            break;

        case "cube":

            this.effectCube(direction);

            break;

        case "flip":

            this.effectFlip(direction);

            break;

        case "coverflow":

            this.effectCoverflow(direction);

            break;

        case "apple":

            this.effectApple(direction);

            break;

        default:

            this.effectSlide(direction);

    }



    //--------------------------------------
    // actualizar datos
    //--------------------------------------

    this.index = index;

    this.title.textContent = slide.titulo;

    this.text.textContent = slide.texto;

}

/*======================================================
=
= ESPERAR FIN
=
======================================================*/

waitAnimation(callback){

    setTimeout(()=>{

        callback();

    },this.config.duration);

}

/*======================================================
=
= EFFECT SLIDE
=
======================================================*/

effectSlide(direction){

    const current = this.currentImage;

    const next = this.nextImage;



    current.style.zIndex = 2;

    next.style.zIndex = 3;



    next.style.transition = "none";

    current.style.transition = "none";



    if(direction === "next"){

        next.style.transform = "translateX(100%)";

    }else{

        next.style.transform = "translateX(-100%)";

    }



    requestAnimationFrame(()=>{

        next.style.transition =
            `transform ${this.config.duration}ms ease`;

        current.style.transition =
            `transform ${this.config.duration}ms ease`;



        if(direction === "next"){

            current.style.transform = "translateX(-100%)";

            next.style.transform = "translateX(0%)";

        }else{

            current.style.transform = "translateX(100%)";

            next.style.transform = "translateX(0%)";

        }

    });



    this.waitAnimation(()=>{

        this.finishAnimation();

    });

}



    /*======================================================
    =
    = EVENTOS
    =
    ======================================================*/

registerEvents(){

    document
        .getElementById("next")
        .addEventListener("click",()=>{

            this.next();

        });

    document
        .getElementById("prev")
        .addEventListener("click",()=>{

            this.prev();

        });


        this.hero.addEventListener("touchstart",(e)=>{

    this.touchStart = e.touches[0].clientX;

});

this.hero.addEventListener("touchend",(e)=>{

    this.touchEnd = e.changedTouches[0].clientX;

    const distancia = this.touchStart - this.touchEnd;

    if(Math.abs(distancia) < 50) return;

    if(distancia > 0){

        this.next();

    }else{

        this.prev();

    }

});

}
    


    finishAnimation(){

        this.swapImages();

        this.currentImage.style.transition="";
        this.nextImage.style.transition="";

        this.currentImage.style.transform="";
        this.nextImage.style.transform="";

        this.currentImage.style.opacity="";
        this.nextImage.style.opacity="";

        this.currentImage.style.filter="";
        this.nextImage.style.filter="";

        this.currentSlide.style.zIndex = 2;

        this.nextSlide.style.zIndex = 1;

        this.currentImage.style.backfaceVisibility="";
        this.nextImage.style.backfaceVisibility="";

        this.currentImage.style.transformStyle="";
        this.nextImage.style.transformStyle="";

        this.lock=false;

    }

    resetLayers(){

        this.currentImage.style.transform="";

        this.nextImage.style.transform="";

        this.currentImage.style.opacity="1";

        this.nextImage.style.opacity="1";

    }

    /*======================================================
=
= EFFECT CUBE
=
======================================================*/

effectCube(direction){

    const current = this.currentImage;

    const next = this.nextImage;



    //------------------------------------
    // preparar capas
    //------------------------------------

    current.style.transition = "none";
    next.style.transition = "none";

    current.style.zIndex = 2;
    next.style.zIndex = 3;

    current.style.backfaceVisibility = "hidden";
    next.style.backfaceVisibility = "hidden";

    current.style.transformStyle = "preserve-3d";
    next.style.transformStyle = "preserve-3d";



    //------------------------------------
    // POSICIÓN INICIAL
    //------------------------------------

    if(direction==="next"){

        next.style.transform=
        "perspective(1800px) rotateY(90deg) translateZ(0px)";

    }else{

        next.style.transform=
        "perspective(1800px) rotateY(-90deg) translateZ(0px)";

    }



    requestAnimationFrame(()=>{

        current.style.transition=
        `transform ${this.config.duration}ms cubic-bezier(.22,.61,.36,1)`;

        next.style.transition=
        `transform ${this.config.duration}ms cubic-bezier(.22,.61,.36,1)`;



        //------------------------------------
        // SIGUIENTE
        //------------------------------------

        next.style.transform=
        "perspective(1800px) rotateY(0deg)";



        //------------------------------------
        // ACTUAL
        //------------------------------------

        if(direction==="next"){

            current.style.transform=
            "perspective(1800px) rotateY(-90deg)";

        }else{

            current.style.transform=
            "perspective(1800px) rotateY(90deg)";

        }

    });



    this.waitAnimation(()=>{

        this.finishAnimation();

    });

}


}





/*=========================================================
=
= INICIO
=
=========================================================*/

const slider = new HeroSlider(slides,CONFIG);


