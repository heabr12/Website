const dialog = document.querySelectorAll(".dialog");
const openBtn = document.querySelectorAll(".open");

openBtn.forEach((btn, i) => btn.addEventListener('click', () => dialog[i].showModal()));



// close modal when clicking outside
dialog.forEach((image, i) => image.addEventListener("click", (event) => {
  const rect = dialog[i].getBoundingClientRect();
  const isInDialog =
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom;

  if (!isInDialog) {
    dialog[i].close();
  }
}));
