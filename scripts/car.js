class Car {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = 5;
    this.friction = 0.05;
    this.angle = 0;
    // Initialize audio context
    this.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    this.engineSoundBuffer = null;
    this.engineSoundSource = null;
    this.engineSoundGain = this.audioContext.createGain();
    this.engineSoundGain.connect(this.audioContext.destination);
    // Load the audio file
    // Load the audio file
    fetch("assets\\sfx\\engine_sound.mp3")
      .then((response) => response.arrayBuffer())
      .then((buffer) => this.audioContext.decodeAudioData(buffer))
      .then((decodedBuffer) => {
        this.engineSoundBuffer = decodedBuffer;
      })
      .catch((error) => console.error("Error loading audio file:", error));

    this.controls = new Controls();
  }
  initializeAudio() {
    this.engineSoundSource = this.audioContext.createBufferSource();
    this.engineSoundSource.buffer = this.engineSoundBuffer;
    this.engineSoundSource.loop = true;

    // Create a pitch shifter (playbackRate node) to adjust sound based on speed
    this.pitchShifter = this.audioContext.createGain();
    this.pitchShifter.gain.value = 1;
    this.engineSoundSource.connect(this.pitchShifter);
    this.pitchShifter.connect(this.engineSoundGain);
  }

  startEngineSound() {
    if (this.engineSoundBuffer) {
      this.initializeAudio();

      if (this.audioContext.state === "suspended") {
        this.audioContext.resume();
      }

      if (this.engineSoundSource) {
        this.engineSoundSource.start(0);

        // Calculate the pitch based on speed
        const minSpeed = 0.1; // Adjust as needed
        const maxSpeed = this.maxSpeed;
        const speed = Math.max(this.speed, minSpeed);
        const pitch = speed / maxSpeed;
        this.pitchShifter.gain.value = pitch;
      }
    }
  }
  stopEngineSound() {
    if (this.engineSoundSource) {
      this.engineSoundSource.stop(0);
    }
  }
  update() {
    if (this.controls.forward) {
      this.speed += this.acceleration;
      this.startEngineSound();
    } else if (this.engineSoundSource) {
      this.stopEngineSound();
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }
    if (this.controls.left) {
      this.angle += 0.03;
    }
    if (this.controls.right) {
      this.angle -= 0.03;
    }
    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2;
    }
    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    if (this.speed < 0) {
      this.speed += this.friction;
    }
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }
    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);
    ctx.beginPath();
    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.fill();
    ctx.restore();
  }
}
