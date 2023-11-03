const CANVAS = document.getElementById("mainCanvas");
const ctx = CANVAS.getContext("2d");

CANVAS.height = window.innerHeight;
CANVAS.width = 900;

const car = new Car(100, 100, 30, 50);
car.draw(ctx);
animate();
function animate() {
  car.update();

  CANVAS.height = window.innerHeight;
  car.draw(ctx);
  requestAnimationFrame(animate);
}
