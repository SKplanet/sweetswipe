
var _cu = {
  getFnName(fn){
    if(typeof fn !== "function") return;
    var sName = (fn.name) ? fn.name : fn.toString().match(/function\s+([^(\(|\s)]+)/)[1];
    return sName;
  },
  setTranslate3dX(ele, nValue) {
    let sTF = this.getCSSName('transform');
    ele.style[sTF] = 'translate3d(' + (nValue) + 'px, 0, 0)';
  },
  getWidth(ele) {
    let nWidth = 0;

    if (ele.getBoundingClientRect().width) {
      nWidth = ele.getBoundingClientRect().width;
    } else {
      nWidth = ele.offsetWidth;
    }
    return nWidth
  },

  getCSSName(sName) {
    if(typeof this.htCacheData === "undefined") this.htCacheData = {};

    if(this.htCacheData[sName]) return this.htCacheData[sName];

    var _htNameSet = {
      'transition' : ['webkitTransition', 'transition' ], 
      'transform' : ['webkitTransform', 'transform' ], 
    }

    let aNameList = _htNameSet[sName];

    if(!this.isExist(aNameList)) return null;

    for(let i=0, len=aNameList.length; i < len ; i++) {
      if(typeof document.body.style[aNameList[i]] === 'string') { 
        this.htCacheData[sName] = aNameList[i];
        return this.htCacheData[sName];
      }
    }
  },

  getChildOrder(elChild) {
    var elParent = elChild.parentNode;
    var nIndex = Array.prototype.indexOf.call(elParent.children, elChild);
    return nIndex;
  },

  getTranslate3dX(ele) {
    let sTF = this.getCSSName("transform");
    let sPreCss = ele.style[sTF];
    let nPreX = +sPreCss.replace(/translate3d\((-*\d+(?:\.\d+)*)(px)*\,.+\)/g , "$1");
    return nPreX;
  },

  getCSSTransitionEnd() {
    let sTS = this.getCSSName('transition');
    let sTSE = (sTS === "webkitTransition") ? "webkitTransitionEnd" : "transitionend";
    return sTSE;
  },

  setCSS(el,style,value) {
    el.style[style] = value;
  },

  showLayer(el) {
    el.style.display = "block";
  },

  closeLayer(el) {
    el.style.display = "none";
  },

  //check null or undefined
  isExist(data){
    return data != null;
  },

  isArray(_a) {
    if (!Array.isArray) {
      return Object.prototype.toString.call(_a) === '[object Array]';
    }
    return Array.isArray(_a);
  },

  isFunction(fn) {
    return Object.prototype.toString.call(fn) === '[object Function]';
  }
}