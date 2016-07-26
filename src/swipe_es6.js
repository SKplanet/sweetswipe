/*
* The MIT License (MIT)
* Copyright (c) 2016 SK PLANET. All Rights Reserved. *
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions: *
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software. *
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE. */

/*!
* \swipe_es6.js v0.1
* \copyright Copyright (c) 2016, SK PLANET. All Rights Reserved. 
* \license This project is released under the MIT License.
* \contributor nigayoun (nigayoun@gmail.com)
* \warning dont'use this source in other library source.
*/
class SweetSwipe extends CommonComponent {

  COMPONENT_CONFIG() {
    return {
     PLUGINS: ['SwipeNavigationPlugin', 'SwipeStepMoverPlugin'],
     SELECTOR: {
		//inputFieldWrap: '.input-wrap', 
    }, 
    DEFAULT_COMPONENT_EVENT: [	
      'FN_BEFORE_SWIPE',
      'FN_AFTER_SWIPE'
    ],
    DEFAULT_PLUGIN_EVENT: [	
      'FN_BEFORE_SWIPE',
      'FN_AFTER_SWIPE'
    ],
    DEFAULT_OPTION: {
      'bCircular': false,
      'nDuration': 100,
      'nBackWidth': 60,
      'nSideWidth': 0,
      'nDecisionSlope': 0.8,
      'nForcedSwipeTime': 0,
      'bSettingScreenHeight': false,
      'bMouseEventSupport' : false
    }
  }
}

  constructor(elTarget, htOption) {
   super(elTarget, htOption);
  }

  initValue(htOption) {
    //set height of viewArea
    //this.setDynamicHeight(1);
    //if(this.option.bSettingScreenHeight) this.elTarget.style.height = window.innerHeight + "px";
    if(this.option.bSettingScreenHeight) this.setDynamicHeight(0);

    //swipe container width
    this.nSwipeWidth = _cu.getWidth(this.elTarget.firstElementChild); //case. position : static(float)

    //swipe element count 
    this.nSwipeElementCount = this.elTarget.childElementCount;

    let bCircular = this.option.bCircular;
    this.nMaxSwipeRange = (bCircular) ? this.nSwipeWidth : 0 ;
    this.nMinSwipeRange = (bCircular) ? (this.nSwipeElementCount -2) : (this.nSwipeElementCount-1);
    this.nMinSwipeRange *= -this.nSwipeWidth;

    this.nMaxValue = this.nMaxSwipeRange + this.option.nSideWidth;
    this.nMinValue = this.nMinSwipeRange - this.option.nSideWidth;

    this.bAnimationing = false;
    this.nNextNumber = 0;
  }

  registerEvents() {
    this.elTarget.addEventListener("touchstart", (evt) => { this.handlerTouchStart(evt) });
    this.elTarget.addEventListener("touchmove", (evt) => { this.handlerTouchMove(evt) });
    this.elTarget.addEventListener("touchend", (evt) => { this.handlerTouchEnd(evt) });

    if(this.option.bMouseEventSupport) {
      this.elTarget.addEventListener("mousedown", (evt) => { this.handlerTouchStart(evt) });
      this.elTarget.addEventListener("mousemove", (evt) => { this.handlerTouchMove(evt) });
      this.elTarget.addEventListener("mouseup", (evt) => { this.handlerTouchEnd(evt) });
    }

    this.registerTransitionEnd();
  }

  /* Event Hanlder */ 

  handlerTouchStart(evt) {
    evt.stopPropagation();
    if(this.bAnimationing) return;

    this.bSwipe = true;
    this.bFirstTouchMove = true;
    let bMouseEvent = evt.type.substr(0,5) === "mouse";

    let pageX,pageY;

    if(bMouseEvent) {
      pageX = evt.pageX; 
      pageY = evt.pageY; 
    } else {
      pageX = evt.changedTouches[0].pageX; 
      pageY = evt.changedTouches[0].pageY; 
    }

    this.nStartPosX = Math.floor(pageX);
    this.nStartPosY = Math.floor(pageY);

    this.nStartTranslateX = _cu.getTranslate3dX(this.elTarget);

    this.nTouchStartTime = Date.now();
  }

  handlerTouchMove(evt) {
    evt.stopPropagation();
    if(this.bAnimationing) return;
    if(!this.bSwipe) return;

    let bMouseEvent = evt.type.substr(0,5) === "mouse";

    let htCurrentEvt = (bMouseEvent) ? evt : evt.changedTouches[0];

    this.nMovePosX = Math.floor(htCurrentEvt.pageX);
    this.nMovePosY = Math.floor(htCurrentEvt.pageY);

    //detect angle 
    if(this.bFirstTouchMove) {
      let nAngleDiff = Math.abs(this.nMovePosY - this.nStartPosY) / Math.abs(this.nMovePosX - this.nStartPosX);
      this.bSwipe = !!(nAngleDiff <= this.option.nDecisionSlope);
      if(this.bSwipe === false) return;
      this.nPreMoveX = this.nStartPosX;
    }

      evt.preventDefault();

      let nMoveDiff = this.nMovePosX - this.nPreMoveX;

      this.dragArea(nMoveDiff);

      this.nPreMoveX = this.nMovePosX;
      this.nPreMoveY = this.nMovePosX;
 
      this.bFirstTouchMove = false;
  }

  handlerTouchEnd(evt) {
    evt.stopPropagation();
    if(this.bAnimationing) return;
	
    if(!this.bSwipe) { 
      this.bOutRangeRight = false;
      this.bOutRangeLeft = false;
      return;
    }

    let nWidthForAnimation = 0;
    let nTouchEndTime = Date.now(); 
    let nDiffTouchTime = nTouchEndTime - this.nTouchStartTime;

    let nLastTranslateX = _cu.getTranslate3dX(this.elTarget);
    let nDiffTranslateX = nLastTranslateX - this.nStartTranslateX;

    if(nDiffTranslateX === 0) return;

    let bSwipeWidth = false;
    let bSwipeTime = false;
    let bSwipeGo = false;
    let sDirection = "";

    bSwipeWidth = Math.abs(nDiffTranslateX) > this.option.nBackWidth;
    if (nDiffTouchTime < this.option.nForcedSwipeTime) bSwipeTime = true;
    //decide direction.
    if( this.bOutRangeLeft || this.bOutRangeRight || !(bSwipeWidth || bSwipeTime) ) { 
      sDirection = (nDiffTranslateX > 0 ) ? "left" : "right";
      nWidthForAnimation = Math.abs(nDiffTranslateX);
    } else {
      bSwipeGo = true;
      sDirection = (nDiffTranslateX > 0 ) ? "right" : "left";
      nWidthForAnimation = this.nSwipeWidth - Math.abs(nDiffTranslateX);
    }

    this.nNextNumber = this._getNextViewNumber(this.nStartTranslateX, sDirection, bSwipeGo);
    this.nNextNumber = Math.round(this.nNextNumber);

    if(this.option.bCircular) {
  	  if(this.nNextNumber === -1) { this.nNextNumber = this.nSwipeElementCount -3}
  		else if(this.nNextNumber === (this.nSwipeElementCount - 2)) { this.nNextNumber = 0}
  		else {}
	  }

    if(sDirection === 'left') nWidthForAnimation = -nWidthForAnimation ;

    //this.bByTouchEnd = true;

    this.runSwipeAction(this.option.nDuration, this.nNextNumber, nWidthForAnimation);

    //TODO. make reset method 
    this.bOutRangeRight = false;
    this.bOutRangeLeft = false;
    this.bSwipe = false;
  }

  runSwipeAction(nDuration, nNextNumber, nWidthForAnimation) {
    if(typeof nWidthForAnimation  === "undefined") { 
       let nWidth = this.nSwipeWidth;
       let nDiff = this.getCurrentViewNumber() - (nNextNumber);
       nWidthForAnimation = nDiff * nWidth;
    }
    this.setNextNumber(nNextNumber);
    super.runCustomFn('USER', 'FN_BEFORE_SWIPE', nNextNumber);
    super.runCustomFn('PLUGIN', 'FN_BEFORE_SWIPE', nNextNumber);
    this.runTransition(this.elTarget, nWidthForAnimation, nDuration/1000); //to second.
  }

  _restoreTransformX(nPanelIndex) {
    let nPanelCount = this.nSwipeElementCount - 3;
    let nPanelWidth = this.nSwipeWidth;
    let nMoveValue = (nPanelCount) * nPanelWidth; //refs : clonedNode is 2.

    if(nPanelIndex === 0)  { 
      _cu.setTranslate3dX(this.elTarget, 0);
    } else if (nPanelIndex === (nPanelCount)) { 
  	  _cu.setTranslate3dX(this.elTarget, -nMoveValue);
    } else {}
  }

  registerTransitionEnd() {
    let sTSE = _cu.getCSSTransitionEnd(); 

      this.elTarget.addEventListener(sTSE, ev => {
        let sTS = _cu.getCSSName('transition');
        this.elTarget.style[sTS] = "none";

        //if(!this.bByTouchEnd) return;

        if(this.option.bCircular) { 
          this._restoreTransformX(this.nNextNumber);
        }

        super.runCustomFn('USER', 'FN_AFTER_SWIPE', this.nNextNumber);
        super.runCustomFn('PLUGIN', 'FN_AFTER_SWIPE', this.nNextNumber);

        if(this.option.bSettingScreenHeight) this.setDynamicHeight(this.nNextNumber);    

        //this.bByTouchEnd = false;
        this.nNextNumber = 0;
      });
  }

  setNextNumber(nNextNumber) {
    this.nNextNumber = nNextNumber;
  }

  setDynamicHeight(nNextNumber) {
    if(this.option.bCircular) { nNextNumber++ } 

    var elCurrent = this.elTarget.children[nNextNumber];
    var nHeight =  parseInt(getComputedStyle(elCurrent).height);
    this.elTarget.style.height = nHeight + "px";
  }

  getCurrentViewNumber() {
    let nIndex = Math.abs(_cu.getTranslate3dX(this.elTarget)) / this.nSwipeWidth;
    return Math.round(nIndex);
  }

  _getNextViewNumber(nPos, sDirection, bSwipeGo) {
    //let nIndex = Math.round(-(nPos / this.nSwipeWidth) + 1);
    let nIndex = Math.round(-(nPos / this.nSwipeWidth));
    if(!bSwipeGo) return nIndex;
    return (sDirection === "left") ? ++nIndex : --nIndex;
  }

  dragArea(nMoveDiff) {
    let nPreX = _cu.getTranslate3dX(this.elTarget);

    this.bOutRangeRight = false;
    this.bOutRangeLeft = false;

    //check valid swipe range. 

    //좌측 끝 상태에서 좌측메뉴로 더 가려고 할때.
    if(nPreX >= this.nMaxSwipeRange) this.bOutRangeLeft = true;

    //TODO. 우측 끝 상태에서 우측메뉴로 더 가려고 할때.
    if(nPreX <= this.nMinSwipeRange) this.bOutRangeRight = true;

    let nNewValue = nPreX + nMoveDiff;

    //이동량이 가능 범위를 넘을때 max값으로 설정.
    if(nNewValue > this.nMaxValue) nNewValue = this.nMaxValue;

    //이동량이 가능 범위를 넘을때 min값으로 설정.
    if(nNewValue < this.nMinValue) nNewValue = this.nMinValue;

    _cu.setTranslate3dX(this.elTarget, nNewValue);
  }

  runTransition(elTarget, nDistance, nDuration) {
    let nPreviousTranslateX = _cu.getTranslate3dX(elTarget);
    let sTS = _cu.getCSSName('transition');
    let sTF = _cu.getCSSName('transform');
    let sValue = "";

    if(sTF === "webkitTransform") sValue = "-webkit-transform";
    else if (sTF === "transform") sValue = "transform";
    else {}

    elTarget.style[sTS] = sValue + " " + nDuration + "s";
    elTarget.style[sTF] = 'translate3d(' + (nPreviousTranslateX + nDistance) + 'px, 0, 0)';
  }

  cloneNodeForCircular () {
    let _elBase = this.elTarget;

    let elLastCloneNode = _elBase.lastElementChild.cloneNode(true);
    let elFirstCloneNode = _elBase.firstElementChild.cloneNode(true);

    elLastCloneNode.className += " cloned";
    elFirstCloneNode.className += " cloned";

    //append first position.
    _elBase.insertBefore(elLastCloneNode, _elBase.firstElementChild);

    //append last position
    _elBase.appendChild(elFirstCloneNode);
  }
}
