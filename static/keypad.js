var numero = document.getElementById('numero')


keypad = {
  value: "",
  add: function (a){
    if(this.value.length < 4){
      this.value+=a
      this.reload()
    }
  },
  reload: function () {
    numero.innerHTML = this.value
  },
  clear: function () {
    this.value = ""
    numero.innerHTML = "."
  },
  send: function(){
    if(this.value == "4444"){
      window.location.replace("/pip");
    }else{
      window.location.replace("/badpip");
    }
  }
}

var press = (val) => {
  if(val >= 0 && val <= 9){
    keypad.add(val)
  }else if(val == 10){
    keypad.clear()
  }else if(val == 11){
    keypad.send()
  }
}
