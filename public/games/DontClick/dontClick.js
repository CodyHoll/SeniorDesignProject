var i = 0;

button = document.querySelector(".DontClick")

button.addEventListener("click", () => {
  i += 1;

  if(i == 1) {
    button.innerHTML = "Pls...";
  }
  else if(i == 2) {
    button.innerHTML = "Last chance"
  }
  else if( i == 3) {
    playSong('7GhIk7Il098yCjg4BQjzvb');
    button.innerHTML = "Never gonna give you up"
  }
  else if(i == 25) { 
    button.innerHTML = "Just refresh the page dummy"
  }
});