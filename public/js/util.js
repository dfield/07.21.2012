function makeElement(className) {
  return $(className + ".template").clone().removeClass("template");
}