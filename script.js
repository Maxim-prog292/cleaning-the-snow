const canvas = document.getElementById("treeCanvas");
const ctx = canvas.getContext("2d");
const treeImage = document.getElementById("treeImage");
const overlay = document.querySelector(".overlay");
const reload = document.querySelector(".reload");
const img = new Image();
img.src = "snow-texture.jpg";
let isCompleted = false; // Флаг для проверки, что елочка уже раскрашена

// Отключаем масштабирование страницы с помощью мыши или касаний
window.addEventListener("mousewheel", function (e) {
  if (e.ctrlKey) {
    e.preventDefault();
    return false;
  }
});
document.addEventListener(
  "touchstart",
  (e) => {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  },
  { passive: false }
);
document.addEventListener(
  "touchmove",
  (e) => {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  },
  { passive: false }
);

// Кнопка перезагрузки
reload.addEventListener("click", () => {
  location.reload();
});

// Устанавливаем размеры canvas в соответствии с экраном
function resizeCanvas() {
  canvas.width = 1920; // Ширина экрана
  canvas.height = 1080; // Высота экрана

  const pattern = ctx.createPattern(img, "repeat");
  ctx.fillStyle = pattern;

  // Рисуем черный слой (имитация черно-белого фильтра)
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Функция для стирания черного слоя
function erase(e) {
  const rect = canvas.getBoundingClientRect();

  const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(x, y, 100, 0, Math.PI * 2); // Радиус стирания
  ctx.fill();

  checkCompletion(); // Проверяем, достигнуты ли 80% прозрачности
}

// Функция для проверки, что 80% фильтра удалено
function checkCompletion() {
  if (isCompleted) return; // Если уже завершено, ничего не делаем

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  let transparentPixels = 0;

  // Считаем количество прозрачных пикселей
  for (let i = 3; i < pixels.length; i += 4) {
    if (pixels[i] === 0) {
      transparentPixels++;
    }
  }

  const totalPixels = canvas.width * canvas.height;
  const transparentPercentage = Math.round(
    (transparentPixels / totalPixels) * 100
  );

  if (transparentPercentage > 90) {
    isCompleted = true; // Устанавливаем флаг завершения
    overlay.classList.remove("hide");
  }
}

// Обработчики событий для мыши и касаний
canvas.addEventListener("mousemove", (e) => {
  if (e.buttons === 1) erase(e); // Проверяем, зажата ли кнопка мыши
});

canvas.addEventListener("touchmove", erase);

// Инициализация
window.onload = () => {
  resizeCanvas();
};

window.onresize = () => {
  resizeCanvas();
};
