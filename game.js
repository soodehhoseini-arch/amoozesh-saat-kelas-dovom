const canvas = document.getElementById("clock");
const ctx = canvas.getContext("2d");
const cx = 160, cy = 160;

let hour, minute;
let currentHourAngle = -90;
let currentMinuteAngle = -90;
let targetHourAngle = -90;
let targetMinuteAngle = -90;

const clockImg = new Image();
clockImg.src = "clock.png";

function generateQuestion() {
  const modes = [
    "quarter_to",
    "half_to",
    "quarter_past",
    "half_past",
    "normal"
  ];

  const mode = modes[Math.floor(Math.random() * modes.length)];
  const baseHour = Math.floor(Math.random() * 12) + 1;

  if (mode === "quarter_to") {
    hour = baseHour > 1 ? baseHour - 1 : 12;
    minute = 45;
    setQuestion(`یک ربع مانده به ساعت ${baseHour}`);
  }
  else if (mode === "half_to") {
    hour = baseHour > 1 ? baseHour - 1 : 12;
    minute = 30;
    setQuestion(`نیم ساعت مانده به ساعت ${baseHour}`);
  }
  else if (mode === "quarter_past") {
    hour = baseHour;
    minute = 15;
    setQuestion(`یک ربع گذشته از ساعت ${baseHour}`);
  }
  else if (mode === "half_past") {
    hour = baseHour;
    minute = 30;
    setQuestion(`نیم ساعت گذشته از ساعت ${baseHour}`);
  }
  else {
    hour = Math.floor(Math.random() * 12) + 1;
    minute = [0,10,20,30,40,50][Math.floor(Math.random()*6)];
    setQuestion("ساعت چند است؟");
  }

  targetHourAngle = (hour % 12) * 30 + minute * 0.5 - 90;
  targetMinuteAngle = minute * 6 - 90;
}

function setQuestion(text) {
  document.getElementById("question").innerText = text;
}

function drawClock() {
  ctx.clearRect(0,0,320,320);
  ctx.drawImage(clockImg, 0, 0, 320, 320);

  const step = 4;

  if (Math.abs(currentHourAngle - targetHourAngle) > step)
    currentHourAngle += currentHourAngle < targetHourAngle ? step : -step;

  if (Math.abs(currentMinuteAngle - targetMinuteAngle) > step)
    currentMinuteAngle += currentMinuteAngle < targetMinuteAngle ? step : -step;

  drawHand(currentHourAngle, 60, 6, "black");
  drawHand(currentMinuteAngle, 90, 4, "red");

  requestAnimationFrame(drawClock);
}

function drawHand(angle, length, width, color) {
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.moveTo(cx, cy);
  ctx.lineTo(
    cx + Math.cos(angle * Math.PI / 180) * length,
    cy + Math.sin(angle * Math.PI / 180) * length
  );
  ctx.stroke();
}

function checkAnswer() {
  const h = parseInt(document.getElementById("hour").value);
  const m = parseInt(document.getElementById("minute").value);
  const msg = document.getElementById("message");

  if (h === hour && m === minute) {
    msg.innerText = "🌟 آفرین! درست گفتی";
    msg.style.color = "green";
    document.getElementById("cheer").play();
  } else {
    msg.innerText = `❌ جواب درست: ${hour}:${minute.toString().padStart(2,"0")}`;
    msg.style.color = "red";
    document.getElementById("wrong").play();
  }
}

function nextLevel() {
  document.getElementById("hour").value = "";
  document.getElementById("minute").value = "";
  document.getElementById("message").innerText = "";
  generateQuestion();
}

clockImg.onload = () => {
  generateQuestion();
  drawClock();
};
