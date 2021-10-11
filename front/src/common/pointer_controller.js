const pointer = { x: 0, y: 0 };

function setPointerPos(x, y) {
  pointer.x = x;
  pointer.y = y;
}

function getPointerPos() {
  return pointer;
}

export { setPointerPos, getPointerPos }