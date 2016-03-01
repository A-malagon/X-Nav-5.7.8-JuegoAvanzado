// Original game from:
// http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
// Slight modifications by Gregorio Robles <grex@gsyc.urjc.es>
// to meet the criteria of a canvas class for DAT @ Univ. Rey Juan Carlos

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/mario.png";

// princess image
var princessReady = false;
var princessImage = new Image();
princessImage.onload = function () {
	princessReady = true;
};
princessImage.src = "images/princess.png";

// monster image
var monstruoReady = false;
var monstruoImage = new Image();
monstruoImage.onload = function () {
	monstruoReady = true;
};
monstruoImage.src = "images/goomba.png";

// stone image
var piedraReady = false;
var piedraImage = new Image();
piedraImage.onload = function () {
	piedraReady = true;
};
piedraImage.src = "images/stone.png";

// vida image
var vidaReady = false;
var vidaImage = new Image();
vidaImage.onload = function () {
	vidaReady = true;
};
vidaImage.src = "images/corazon.png";

// seta image
var setaReady = false;
var setaImage = new Image();
setaImage.onload = function () {
	setaReady = true;
};
setaImage.src = "images/seta.png";

// Game objects
var hero = {
	//speed: 256 // movement in pixels per second
};
var princess = {};
var princessesCaught = localStorage.getItem("princess") || 0;
var vida = {};
var vidas = [];
var seta = {};
var setas = [];
var vidasCaught = localStorage.getItem("vida") || 1;
var monstruo = {};
var piedra = {};
var monstruos = [];
var piedras = [];

var numVidas = 1;
var numSetas = 1;
var numPiedras = localStorage.getItem("piedra") || 5;
var numMonstruos = localStorage.getItem("monstruo") || 2;
var speedMonstruos = 30;
var speedVidas =280;
var nivel = localStorage.getItem("nivel") || 1;
var pause = localStorage.getItem("pause") || false;
var record = localStorage.getItem("record") || 1;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);


addEventListener("keypress", function(e){
	if (e.charCode == 112){
		var pausarPartida = document.getElementById("pausar");
		var texto = "";
		if (pause){
			pause = false;
		}else{
			texto = "PAUSA";
			pause = true;
		}
		pausarPartida.innerHTML = texto;
	}
}, false);


// Reset the game when the player catches a princess
var reset = function () {
    hero = {speed: 256}
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the princess somewhere on the screen randomly
    //El tamaño de arbol es 32, le quitamos 32 y la princesa ya no se pone en los arboles.
	princess.x = 32 + (Math.random() * (canvas.width - 96));
	princess.y = 32 + (Math.random() * (canvas.height - 96));

	monstruos = []; //REINICIA LOS MONSTRUOS.
    var monstruoPuesto = 0;
	while(monstruoPuesto < numMonstruos){
		monstruo = {speed: speedMonstruos}
		monstruo.x = 32 + (Math.random() * (canvas.width - 96));
		monstruo.y = 32 + (Math.random() * (canvas.height - 96));
        monstruoPuesto++;
        
		//Si coincide el monstruo con la princesa o heroe, se resta uno al contador y no insertamos en el array
		if(hero.x < (monstruo.x + 32) && monstruo.x < (hero.x + 32)
           && hero.y < (monstruo.y + 32) && monstruo.y < (hero.y + 32)
		   || princess.x < (monstruo.x + 32) && monstruo.x < (princess.x + 32)
           && princess.y < (monstruo.y + 32) && monstruo.y < (princess.y + 32)){

			    monstruoPuesto--;
		} else {        
    		monstruos.push(monstruo);
        }
	}

	piedras = []; //REINICIA LAS PIEDRAS.
    var piedraPuesta = 0;
	while(piedraPuesta < numPiedras){
		piedra = {}
		piedra.x = 32 + (Math.random() * (canvas.width - 96));
		piedra.y = 32 + (Math.random() * (canvas.height - 96));
        piedraPuesta++;
        
		//Si coincide la piedra con la princesa o heroe, se resta uno al contador y no insertamos en el array
		if(hero.x < (piedra.x + 32) && piedra.x < (hero.x + 32)
           && hero.y < (piedra.y + 32) && piedra.y < (hero.y + 32)
		   || princess.x < (piedra.x + 32) && piedra.x < (princess.x + 32)
           && princess.y < (piedra.y + 32) && piedra.y < (princess.y + 32)){

			    piedraPuesta--;
		} else {        
    		piedras.push(piedra);
        }
	}    

    resetVidas();
    resetSetas();
};


var resetVidas = function () {  

	vidas = []; //REINICIA LAS VIDAS.
    var vidaPuesta = 0;
	while(vidaPuesta < numVidas){
		vida = {speed: speedVidas}
		vida.x = 32 + (Math.random() * (canvas.width - 96));
		vida.y = 32 + (Math.random() * (canvas.height - 96));
        vidaPuesta++;
        
		//Si coincide la vida con la princesa o heroe, se resta uno al contador y no insertamos en el array
		if(hero.x < (vida.x + 32) && vida.x < (hero.x + 32)
           && hero.y < (vida.y + 32) && vida.y < (hero.y + 32)
		   || princess.x < (vida.x + 32) && vida.x < (princess.x + 32)
           && princess.y < (vida.y + 32) && vida.y < (princess.y + 32)){

			    vidaPuesta--;
		} else {        
    		vidas.push(vida);
        }
	}
};

var resetSetas = function () {  

	setas = []; //REINICIA LAS SETAS.
    var setaPuesta = 0;
	while(setaPuesta < numSetas){
		seta = {}
		seta.x = 32 + (Math.random() * (canvas.width - 96));
		seta.y = 32 + (Math.random() * (canvas.height - 96));
        setaPuesta++;
        
		//Si coincide la seta con la princesa o heroe, se resta uno al contador y no insertamos en el array
		if(hero.x < (seta.x + 32) && seta.x < (hero.x + 32)
           && hero.y < (seta.y + 32) && seta.y < (hero.y + 32)
		   || princess.x < (seta.x + 32) && seta.x < (princess.x + 32)
           && princess.y < (seta.y + 32) && seta.y < (princess.y + 32)){

			    setaPuesta--;
		} else {        
    		setas.push(seta);
        }
	}
};




var mueveMonstruos = function(i, modifier){
	distanciaX = monstruos[i].x - hero.x;
	distanciaY = monstruos[i].y - hero.y;
	if(distanciaX > 0){
		monstruos[i].x -= monstruos[i].speed * modifier; 
	}else if (distanciaX < 0){
		monstruos[i].x += monstruos[i].speed * modifier;
	}
	if(distanciaY > 0){
		monstruos[i].y -= monstruos[i].speed * modifier; 
	}else if (distanciaY < 0){
		monstruos[i].y += monstruos[i].speed * modifier;
	}

};

var pierdeHeroe = function(i){
	if (hero.x <= (monstruos[i].x + 28)
		&& monstruos[i].x <= (hero.x + 28)
		&& hero.y <= (monstruos[i].y + 28)
		&& monstruos[i].y <= (hero.y + 28)) {

            vidasCaught--;
            if (vidasCaught < 1) { 
                princessesCaught = 0;
		        numMonstruos = 2;
		        speedMonstruos = 30;
		        numPiedras = 5;
		        nivel = 1;
                vidasCaught = 0;
            }
            localStorage.setItem("princess", princessesCaught);
            localStorage.setItem("vida", vidasCaught);
            localStorage.setItem("nivel", nivel);
            localStorage.setItem("monstruo", numMonstruos);
            localStorage.setItem("piedra", numPiedras);
            localStorage.setItem("pause", pause);
            localStorage.setItem("record", record);
            reset();
	}
};

var monstruosInteligentes = function (modifier) {
    i=0;
    while(i < numMonstruos){
        mueveMonstruos(i, modifier);
        pierdeHeroe(i);
        i++;
    }

};

var mueveVidas = function(i, modifier){
	distVidaX = vidas[i].x - hero.x;
	distVidaY = vidas[i].y - hero.y;
	if(distVidaX > 0){
		vidas[i].x += vidas[i].speed * modifier; 
	}else if (distVidaX < 0){
		vidas[i].x -= vidas[i].speed * modifier;
	}
	if(distVidaY > 0){
		vidas[i].y += vidas[i].speed * modifier; 
	}else if (distVidaY < 0){
		vidas[i].y -= vidas[i].speed * modifier;
	}
    
    vidaDentro();

};

var vidaHeroe = function(i){
	if (hero.x <= (vidas[i].x + 28)
		&& vidas[i].x <= (hero.x + 28)
		&& hero.y <= (vidas[i].y + 28)
		&& vidas[i].y <= (hero.y + 28)) {

            vidasCaught++;
            localStorage.setItem("vida", vidasCaught);
            resetVidas();
	}
};

var vidasInteligentes = function (modifier) {
    i=0;
    while(i < numVidas){
        mueveVidas(i, modifier);
        vidaHeroe(i);
        i++;
    }

};

var setaHeroe = function(i){
	if (hero.x <= (setas[i].x + 28)
		&& setas[i].x <= (hero.x + 28)
		&& hero.y <= (setas[i].y + 28)
		&& setas[i].y <= (hero.y + 28)) {

            hero.speed += 20;
            resetSetas();
	}
};

var setasInteligentes = function (modifier) {
    i=0;
    while(i < numSetas){
        setaHeroe(i);
        i++;
    }

}; 


var heroeDentro = function (){
	if(hero.x > (canvas.width - 64)){
		hero.x = canvas.width -64;
	}else if(hero.x < 32){
		hero.x = 32;
	}else if(hero.y > (canvas.height - 64)){
		hero.y = canvas.height - 64;
	}else if(hero.y < 32){
		hero.y = 32;
	}
};

var vidaDentro = function (){
	if(vida.x > (canvas.width - 64)){
		vida.x = canvas.width -64;
	}else if(vida.x < 32){
		vida.x = 32;
	}else if(vida.y > (canvas.height - 64)){
		vida.y = canvas.height - 64;
	}else if(vida.y < 32){
		vida.y = 32;
	}
};

var obstaculo = function (modifier) {
    i = 0;	
    while(i<numPiedras){
		if(hero.x < (piedras[i].x + 24) && piedras[i].x < (hero.x + 24)
           && hero.y < (piedras[i].y + 24) && piedras[i].y < (hero.y + 24)){
			
            if (38 in keysDown) { // Player holding up
				hero.y += hero.speed * modifier;
			}
			if (40 in keysDown) { // Player holding down
				hero.y -= hero.speed * modifier;
			}
			if (37 in keysDown) { // Player holding left
				hero.x += hero.speed * modifier;
			}
			if (39 in keysDown) { // Player holding right
				hero.x -= hero.speed * modifier;
			}	
		}
        i++;
	}

};

var siguienteNivel = function () {
    var siguienteNivel = 10 * nivel
    if(princessesCaught == siguienteNivel){
        nivel++;
        if (record < nivel) {
            record++;
        }
		numMonstruos += 2;
		speedMonstruos += 10;
		numPiedras += 2;
        localStorage.setItem("princess", princessesCaught);
        localStorage.setItem("vida", vidasCaught);
        localStorage.setItem("nivel", nivel);
        localStorage.setItem("monstruo", numMonstruos);
        localStorage.setItem("piedra", numPiedras);
        localStorage.setItem("pause", pause);
        localStorage.setItem("record", record);
		reset();
	}  
};

// Update game objects
var update = function (modifier) {
    if (pause) { // nada se mueve en pausa
		return;	
	}

	if (38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
	}

	// Are they touching?
	if (
		hero.x <= (princess.x + 28)
		&& princess.x <= (hero.x + 28)
		&& hero.y <= (princess.y + 28)
		&& princess.y <= (hero.y + 28)
	) {
		++princessesCaught;
        localStorage.setItem("princess", princessesCaught);
        localStorage.setItem("vida", vidasCaught);
        localStorage.setItem("nivel", nivel);
        localStorage.setItem("monstruo", numMonstruos);
        localStorage.setItem("piedra", numPiedras);
        localStorage.setItem("pause", pause);
        localStorage.setItem("record", record);
		reset();
	}

	monstruosInteligentes(modifier);
    
    vidasInteligentes(modifier);

    setasInteligentes(modifier);
    
    heroeDentro();
    
    vidaDentro();

    obstaculo(modifier);

    siguienteNivel();
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (princessReady) {
		ctx.drawImage(princessImage, princess.x, princess.y);
	}


	if(monstruoReady){
		for(i=0;i<numMonstruos;i++){
			ctx.drawImage(monstruoImage, monstruos[i].x, monstruos[i].y);
		}
	}

	if(piedraReady){
		for(i=0;i<numPiedras;i++){
			ctx.drawImage(piedraImage, piedras[i].x, piedras[i].y);
		}
	}

	if(vidaReady){
		for(i=0;i<numVidas;i++){
			ctx.drawImage(vidaImage, vidas[i].x, vidas[i].y);
		}
	}

	if(setaReady){
		for(i=0;i<numSetas;i++){
			ctx.drawImage(setaImage, setas[i].x, setas[i].y);
		}
	}

	//Nivel
	ctx.fillStyle = "rgb(20,190,190)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Nivel: " + nivel, 372, 420);
	//Vidas
	ctx.fillStyle = "rgb(20,190,190)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Vidas: " + vidasCaught, 372, 32);
	// Score
	ctx.fillStyle = "rgb(20,190,190)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Princesas atrapadas: " + princessesCaught, 32, 32);
	// Record
	ctx.fillStyle = "rgb(20,190,190)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Nivel record: " + record, 32, 420);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
//The setInterval() method will wait a specified number of milliseconds, and then execute a specified function, and it will continue to execute the function, once at every given time-interval.
//Syntax: setInterval("javascript function",milliseconds);
setInterval(main, 1); // Execute as fast as possible
