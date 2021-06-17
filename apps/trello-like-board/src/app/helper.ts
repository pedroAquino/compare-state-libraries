import { Coords } from "./state";

function offset(el: HTMLElement): Coords {
  var rect = el.getBoundingClientRect(),
  scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
  scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { x: rect.left + scrollTop, y: rect.top + scrollLeft }
}

function dimensions(el: HTMLElement) {
  return {
    width: el.offsetWidth,
    height: el.offsetHeight
  }
}

export function wasDraggedInside(draggingElOffset: Coords | null, draggingArea: HTMLElement | null) {
  if (!draggingElOffset|| !draggingArea)
    return false;
  const draggingAreaOffset = offset(draggingArea);
  const draggingAreaDimensions = dimensions(draggingArea);
  
  return draggingElOffset.x > draggingAreaOffset.x && 
    draggingElOffset.x < (draggingAreaDimensions.width + draggingAreaOffset.x);
}