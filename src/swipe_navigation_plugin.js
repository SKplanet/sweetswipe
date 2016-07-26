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
* \SwipeNavigationPlugin.js v0.1
* \copyright Copyright (c) 2016, SK PLANET. All Rights Reserved. 
* \license This project is released under the MIT License.
* \contributor nigayoun (nigayoun@gmail.com)
* \warning dont'use this source in other library source.
*/

class SwipeNavigationPlugin extends CommonComponent {
  COMPONENT_CONFIG() {
    return {
      SELECTOR: {
      },
      DEFAULT_COMPONENT_EVENT: [],
      DEFAULT_OPTION: {
        'usage': false,
        'elNaviWrap': null,  //own element(#iScrollArea)
        'seletedClassName': 'selected-swipe-li',
        'nDuration' : 200,
        'bMouseEventSupport': false
      }
    }
  }

  constructor(elTarget, htOption) {
   super(elTarget, htOption);
  }

  initValue() {
    this.elPluginTarget
    this.elNaviWrap = this.option.elNaviWrap;
    this.oParentInstance = null;
  }

  registerEvents() {
    this.moveSwipeArea();
  }

  moveSwipeArea() {
    let lis = this.option.elNaviWrap.querySelectorAll("li");

    let that = this;
    for(let i=0 ; i<lis.length; i++) {
      lis[i].addEventListener("touchend", function(ev){ 
        that.moveparentSwipePanel(this);
      });
    }

    if(this.option.bMouseEventSupport) {
      for(let i=0 ; i<lis.length; i++) {
        lis[i].addEventListener("click", function(ev){ 
          that.moveparentSwipePanel(this);
        });
      }
    }
  }

  moveparentSwipePanel(elTarget) {
    let nWidth = this.oParentInstance.nSwipeWidth;
    let nChildOrder = _cu.getChildOrder(elTarget);

    let nDiff = this.oParentInstance.getCurrentViewNumber() - nChildOrder ;
    let nMoveValue = nDiff * nWidth;

    let nNextNumber = nChildOrder;

    //for no animation, nDuration set zero.
    this.oParentInstance.runSwipeAction(this.option.nDuration, nNextNumber);

    this.highlightSelectedLI(nChildOrder);
  }

  highlightSelectedLI(nSelectedCount) {
    nSelectedCount++;
    //remove legacy class
    let _li = this.option.elNaviWrap.querySelector("." + this.option.seletedClassName);
    let _curClassName = _li.className;
    _li.className = _li.className.replace(_curClassName, "");

    //add new class
    this.option.elNaviWrap.querySelector("li:nth-child("+ nSelectedCount +")").className += " " + this.option.seletedClassName;
  }

  dockingPluginMethod(oParent) {
    oParent.registerPluginMethod({
      'FN_BEFORE_SWIPE' : this.highlightSelectedLI.bind(this), 
      'FN_AFTER_SWIPE' : function(){}
    });
    this.oParentInstance = oParent;
  }
}
