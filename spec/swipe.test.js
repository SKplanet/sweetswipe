
describe("SwipeSwipe Unit Test", function() {

	var elBase = document.getElementById("swipeWrap");
	var o = new SweetSwipe(elBase, {
	  'nDuration' : 100,  //default 100
		'nBackWidth' : 60,  //default 60
		'nSideWidth' : 20,  //default 0
		'nDecisionSlope' : 0.8, //default 0.8
		'nForcedSwipeTime' : 100, //default 0
		'bSettingScreenHeight':true, //default false
		'bMouseEventSupport': true    // default false
	});
	var _fnTest = null;

	before(function() {
		console.log("=============== [TEST START] swipe test  =============");

		//given
		o.bAnimationing  = false
		o.bSwipe = true;
		o.bFirstTouchMove = true;
		o.nPreMoveX = 0;
		o.nPreMoveY = 0;

	});

	it('touch move slope', function () {
		//given
		o.nStartPosX = 200;
		o.nStartPosY = 200;

		o.handlerTouchMove({
			//slope 1
			"changedTouches" : [ { "pageX" : 100, "pageY" : 100} ],
			"type" : "touchmove",
			"preventDefault" : function(){},
			"stopPropagation" : function(){}
		});

		var nResult = _cu.getTranslate3dX(elBase);
		nResult.should.be.equal(0);

	});


	it('side swipe limit', function () {
		//given
		o.bFirstTouchMove = false;
		o.bSwipe = true;

		o.handlerTouchMove({
			"changedTouches" : [ { "pageX" : o.option.nSideWidth+100, "pageY" : 0} ],
			"type" : "touchmove",
			"preventDefault" : function(){},
			"stopPropagation" : function(){}
		});

		var nResult = _cu.getTranslate3dX(elBase);
		nResult.should.be.equal(o.option.nSideWidth);
	});


	it('TouchMove handler', function () {
		//given
		o.nPreMoveX = 100;
		_cu.setTranslate3dX(elBase, 0);

		//when
		o.handlerTouchMove({
			"changedTouches" : [ { "pageX" : 40, "pageY" : 100} ],
			"type" : "touchmove",
			"preventDefault" : function(){},
			"stopPropagation" : function(){}
		});

		//test
		var nResult = _cu.getTranslate3dX(elBase);
		nResult.should.be.equal(-60);
	});


	it('TouchEnd handler', function () {
		var touchMoveXDistance = -200;

		_cu.setTranslate3dX(elBase, touchMoveXDistance);

		//given
		o.bAnimationing  = false
		o.bSwipe = true;
		o.bOutRangeRight = false;
    o.bOutRangeLeft = false;
		o.nTouchStartTime = Date.now();
		o.nStartTranslateX = 0;

		//when
		o.handlerTouchEnd({
			"stopPropagation" : function(){}
		});

		//test
		var nResult = _cu.getTranslate3dX(elBase);
		nResult.should.be.equal(-o.nSwipeWidth);
	});


	it('runSwipeAction', function (done) {
		var panelNumber = 2;
		var duration = 1000;

		o.runSwipeAction(duration, panelNumber, -o.nSwipeWidth);

		//Async Logic
		setTimeout(function() {
		  var nAfterX = _cu.getTranslate3dX(elBase);
			nAfterX.should.be.equal((-1) * o.nSwipeWidth * panelNumber);
			done();
		}, 100);
	});

	it("After callback", function(done) {
		//given
		var panelNumber = 3;
		o.registerUserMethod({
			'FN_AFTER_SWIPE': function(n) { 
				_fnTest(n);
			}
		});

		//when
		var duration = 1000;
		o.runSwipeAction(duration, panelNumber, -o.nSwipeWidth);

		//test
		_fnTest = function(n) {
			setTimeout(function(){
				n.should.be.equal(panelNumber);
				done();
			},1);
		}

	});


	it("Navigation plugin", function() {

		_fnTest = function(){}; //Clear callback that be setted at previous test.

		//given
		o.onPlugins([
		{ 
			'name'      : 'SwipeNavigationPlugin',
			'option'    : {
				'usage' : true,
				'elNaviWrap' : document.querySelector("#swipeNaviWrap > ul"),
				'seletedClassName': 'selected-swipe-li',
				'nDuration': 200,
				'bMouseEventSupport' : true
			},
			'userMethod' : {}
		}]);

		//when
		var duration = 1000;
		var panelNumber = 2;
		o.runSwipeAction(duration, panelNumber, o.nSwipeWidth);

		//test
		var className = document.querySelector("#swipeNaviWrap li:nth-child("+ ++panelNumber +")").className.trim();
		className.should.be.equal('selected-swipe-li');

	});

});

