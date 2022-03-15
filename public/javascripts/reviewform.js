document.getElementById("proButton").addEventListener("click", () => {
  document.getElementById("proButton").classList.add("invisible", "h-0", "py-0", "px-0");
  document.getElementById("proButton").classList.remove("py-4", "mt-2", "px-10");
  document.getElementById("proBullets2").classList.remove("invisible", "h-0");
  document.getElementById("proBullets3").classList.remove("invisible", "h-0");
  document.getElementById("proBullets2").classList.add("mt-4", "py-3");
  document.getElementById("proBullets3").classList.add("mt-4", "py-3");
});

document.getElementById("conButton").addEventListener("click", () => {
  document.getElementById("conButton").classList.add("invisible", "h-0", "py-0", "px-0");
  document.getElementById("conButton").classList.remove("py-4", "mt-2", "px-10");
  document.getElementById("conBullets2").classList.remove("invisible", "h-0");
  document.getElementById("conBullets3").classList.remove("invisible", "h-0");
  document.getElementById("conBullets2").classList.add("mt-4", "py-3");
  document.getElementById("conBullets3").classList.add("mt-4", "py-3");
});
