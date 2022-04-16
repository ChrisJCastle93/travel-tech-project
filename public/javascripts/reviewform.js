// DOM manipulation for the review form - gives the user the ability to show extra fields to add more information about their review.

const toggleClassList = (id, method, classLists) => {
  document.getElementById(id).classList[method](...classLists);
};

document.getElementById("proButton").addEventListener("click", () => {
  toggleClassList("proButton", "add", ["invisible", "h-0", "py-0", "px-0"]);
  toggleClassList("proButton", "remove", ["py-4", "mt-2", "px-10"]);
  toggleClassList("proBullets2", "remove", ["invisible", "h-0"]);
  toggleClassList("proBullets3", "remove", ["invisible", "h-0"]);
  toggleClassList("proBullets2", "add", ["mt-4", "py-3"]);
  toggleClassList("proBullets3", "add", ["mt-4", "py-3"]);
});

document.getElementById("conButton").addEventListener("click", () => {
  toggleClassList("conButton", "remove", ["py-4", "mt-2", "px-10"]);
  toggleClassList("conButton", "add", ["invisible", "h-0", "py-0", "px-0"]);
  toggleClassList("conBullets2", "remove", ["invisible", "h-0"]);
  toggleClassList("conBullets3", "remove", ["invisible", "h-0"]);
  toggleClassList("conBullets2", "add", ["mt-4", "py-3"]);
  toggleClassList("conBullets3", "add", ["mt-4", "py-3"]);
});