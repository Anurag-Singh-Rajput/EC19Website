const cursor = document.querySelector(".cursor-wrapper");

document.addEventListener("mousemove", e => {
  cursor.setAttribute(
    "style",
    "transform: translate(" + (e.pageX - 20) + "px," + (e.pageY - 20) + "px);"
  );
});

document.addEventListener("click", () => {
  cursor.classList.add("expand");

  setTimeout(() => {
    cursor.classList.remove("expand");
  }, 500);
});
