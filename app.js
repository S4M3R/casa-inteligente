var five = require("johnny-five");
var express = require('express')
var app = express()

const PORT = 8080

var board = new five.Board({port: 'COM13'});

app.set('view engine', 'pug')

app.use('/static',express.static('static'))



board.on("ready", function() {

var luces = {
  a:{
    jf:five.Led(2),
    val: false
    },
  b:{
    jf:five.Led(4),
    val: false
  },
  c:{
    jf:five.Led(13),
    val: false
  },
  d:{
    jf:five.Led(7)
  }
}


var puerta = {
 jf:new five.Servos([5]),
 abierta: false,
 toggle: function (){
   if(this.abierta){
     this.abierta = false
     this.jf.to(0)
   }else{
     this.abierta = true
     this.jf.to(90)
   }
 },
 cerrar: function () {
   if (this.abierta) {
     this.abierta = false
     this.jf.to(0)
   }
 },
 abrir: function () {
   if (!this.abierta) {
     this.abierta = true
     this.jf.to(90)
   }
 },
}

new five.Proximity({
  controller: "HCSR04",
  pin: 8
});

var alarma = {
  montada: false,
  prendida: false,
  on: function (){
    if(this.montada && !this.prendida){
      luces.d.jf.strobe(200)
      this.prendida = true
    }
  },
  off: function () {
    luces.d.jf.stop()
    luces.d.jf.off()
    this.prendida = false
  },
  montar: function () {
    this.montada = !this.montada
    this.off()
  }

}

luces.a.jf.off()
luces.b.jf.off()
luces.c.jf.off()
puerta.cerrar()

proximity = new five.Proximity({
  controller: "HCSR04",
  pin: 8
});

proximity.on("data", function() {
  if(this.cm < 5){
    alarma.on()
  }
  });

app.get('/panel', (req,res) => {
  res.render('index', {luces, puerta, alarma})
})

app.get('/', (req,res) => {
  res.render('keypad')
})

app.get('/led/a', (req,res) => {
  luces.a.jf.toggle()
  luces.a.val = !luces.a.val
  res.redirect('/panel')
})


app.get('/led/b', (req,res) => {
  luces.b.jf.toggle()
  luces.b.val = !luces.b.val
  res.redirect('/panel')
})

app.get('/led/c', (req,res) => {
  luces.c.jf.toggle()
  luces.c.val = !luces.c.val
  res.redirect('/panel')
})

app.get('/puerta', (req,res) => {
  puerta.toggle()
  res.redirect('/panel')
})

app.get('/pip', (req,res) => {
  luces.d.jf.on()
  setTimeout(function() {luces.d.jf.off()}, 100)

  res.redirect('/panel')
})

app.get('/badpip', (req,res) => {
  luces.d.jf.on()
  setTimeout(function() {luces.d.jf.off()}, 500)

  res.redirect('/')
})

app.get('/alarma/apagar', (req,res) => {
  alarma.off()
  res.redirect('/panel')
})

app.get('/alarma/montar', (req,res) => {
  alarma.montar()
  res.redirect('/panel')
})

app.get('/alarma/prender', (req,res) => {
  alarma.on()
  res.redirect('/panel')
})


app.listen(PORT, () => {
  console.log('Funcionando en '+PORT)
})

setTimeout(function(){alarma.montar()}, 3000)
})
