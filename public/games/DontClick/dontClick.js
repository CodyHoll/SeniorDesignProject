var i = 0;

button = document.querySelector(".DontClick")

button.addEventListener("click", () => {
  i += 1;

  if(i == 1) {
    button.innerHTML = "pls...";
  }
  else if(i == 2) {
    button.innerHTML = "last chance"
  }
  else if( i == 3) {
    playSong('7GhIk7Il098yCjg4BQjzvb');
    button.innerHTML = "now theres no stopping it"
  }
  else if(i == 25) { 
    button.innerHTML = "just refresh the page dummy"
  }
});