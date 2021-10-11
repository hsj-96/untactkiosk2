import { getPointerPos } from './pointer_controller'; 

let status = 'home'; // home | modeSelection | easyOrder easyMenuSelect | normalOrder normalMenuSelect normalShowResult
function setPageStatus(value) {
  status = value;
}
function getPageStatus() {
  return status;
}

const CUSTOM_CLASS = [ 'scale1', 'scale2', 'scale3', 'border' ];
function getClassList() {
  return CUSTOM_CLASS;
}

const refList = {
  home: [],
  modeSelection: [],
  easyOrder: [],
  easyMenuSelect: [],
  normalOrder: [],
  normalMenuSelect: [],
  normalShowResult: []
};
function initRefList() {
  refList[getPageStatus()] = [];
};
function addRef(ref, path, name, type, className) {
  // path : home | modeSelection | easyOrder easyMenuSelect | normalOrder normalMenuSelect normalShowResult
  // type : click | hover

  const data = { dom: ref.current, path: path, name: name, type: type, className: className };
  
  if(!refList[path].find(obj => obj.name === name)) {
    refList[path].push(data);
  }
}
function getRefList(path) {
  return refList[path];
}

const TICK_TIME = 4;
const SLIDE_TICK_TIME = 2;
let pointerTimer = 0;
let currentRef = null;
let isPointerInBox = false;
function checkPointerInBox(callback) {
  const refList = getRefList(getPageStatus());
  const pointer = getPointerPos();

  if(!refList) return;

  for(let ref of refList) {
    const rect = ref.dom.getBoundingClientRect();
    if(pointer.x > rect.left && pointer.x < rect.right &&
      pointer.y > rect.top && pointer.y < rect.bottom) {
        if(currentRef !== ref) { // 현재 선택된 ref 변경
          pointerTimer = 0;
          currentRef = ref;
          
          refList.map((data) => data.dom.classList.remove(...getClassList()));
          
          if(ref?.className) {
            ref.dom.classList.add(ref.className);
          }
          ref.dom.classList.add('border');

          stopPieLoading();
          if(ref.type === 'click') {
            if(!(getPageStatus() === 'normalOrder' && (ref.name === 'leftBtnRef' || ref.name === 'rightBtnRef'))) {
              pieInterval = setInterval(() => {drawPieLoading(5)}, 30);
            }
          }
        }

        isPointerInBox = true;
        pointerTimer++;
        if((getPageStatus() === 'normalOrder' && pointerTimer >= SLIDE_TICK_TIME && (ref.name === 'leftBtnRef' || ref.name === 'rightBtnRef')) 
          || (pointerTimer >= TICK_TIME && ref.type === 'click')) {
          ref.dom.click();
          ref.dom.classList.remove(...getClassList());
          currentRef = null;
          pointerTimer = 0;
          stopPieLoading();
        }
      break;
    }
    else {
      isPointerInBox = false;
    }
  }

  callback();
}

setInterval(() => {
  checkPointerInBox(() => {
    if(!isPointerInBox) {
      const refList = getRefList(getPageStatus());
      refList.map((data) => data.dom.classList.remove(...getClassList()));
      pointerTimer = 0;
      currentRef = null;
      stopPieLoading();
    }
  });
}, 300);

let currPieVal = 0;
let pieInterval;
function drawPieLoading(upVal) {
  const circleElem = document.querySelector('.circlePointer');
  
  if(!circleElem || currPieVal > 100) return;

  currPieVal += upVal;
  circleElem.style.background = `conic-gradient(rgb(33, 187, 30) ${currPieVal}%, rgba(33, 187, 30, 0.5) 0 100%)`;
}
function stopPieLoading() {
  const circleElem = document.querySelector('.circlePointer');
  circleElem.style.background = 'rgba(33, 187, 30, 0.5)';
  currPieVal = 0;
  clearInterval(pieInterval);
}

/*
window.addEventListener('keydown', (event) => {
  console.log(getPageStatus());
  console.log(refList[getPageStatus()]);
});
*/

export { setPageStatus, addRef, initRefList }