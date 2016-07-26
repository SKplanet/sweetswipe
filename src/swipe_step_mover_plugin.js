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
* \SwipeStepMoverPlugin.js v0.1
* \copyright Copyright (c) 2016, SK PLANET. All Rights Reserved. 
* \license This project is released under the MIT License.
* \contributor nigayoun (nigayoun@gmail.com)
* \warning dont'use this source in other library source.
*/

class SwipeStepMoverPlugin extends CommonComponent {
  COMPONENT_CONFIG() {
    return {
      SELECTOR: {},
      DEFAULT_COMPONENT_EVENT: [],
      DEFAULT_OPTION: {
        'prevButton': null, 
        'nextButton': null,
        'nDuration' : 200
      }
    }
  }

  constructor(elTarget, htOption) {
   super(elTarget, htOption);
  }

  initValue() {
    this.elPluginTarget
    this.elPrevBtn = this.option.prevButton;
    this.elNextBtn = this.option.nextButton;
    this.oParentInstance = null;
  }

  registerEvents() {
    this.elPrevBtn.addEventListener("click", (evt) => { this.handlerClickButton(evt, "toLeft") });
    this.elNextBtn.addEventListener("click", (evt) => { this.handlerClickButton(evt, "toRight") });
  }

  handlerClickButton(evt, sDirection) {
    let nCur = this.oParentInstance.getCurrentViewNumber();

    if(nCur === 0 && sDirection ==="toLeft") return;
    if(nCur === this.oParentInstance.nSwipeElementCount-1 && sDirection ==="toRight") return;

    let nWidth = this.oParentInstance.nSwipeWidth;

    if (sDirection === "toRight") { 
      nWidth *= -1;
      nCur++;
    } else {
      nCur--;
    }

    //for no animation, nDuration set zero.
    this.oParentInstance.runSwipeAction(this.option.nDuration, nCur, nWidth);
  }

  setDisplayOfButton(nCurrentPanel) {
    let nMaxPanel = this.oParentInstance.nSwipeElementCount - 1;
    if (nCurrentPanel === nMaxPanel) { 
      this.elPrevBtn.style.display = "block";
      this.elNextBtn.style.display = "none";
    } else if (nCurrentPanel === 0) { 
      this.elPrevBtn.style.display = "none";
      this.elNextBtn.style.display = "block";
    } else {
      this.elPrevBtn.style.display = "block";
      this.elNextBtn.style.display = "block";
    }
  }

  dockingPluginMethod(oParent) {
    oParent.registerPluginMethod({
      'FN_COMPONENT_DID_LOAD' : this.setDisplayOfButton.bind(this,0),
      'FN_AFTER_SWIPE' : this.setDisplayOfButton.bind(this)
    });
    this.oParentInstance = oParent;
  }
}
