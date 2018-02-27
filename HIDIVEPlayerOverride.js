(function(){
	var p = {
		//----------------------------------------
		// PROGRAMMER CONFIGURATION VARIABLES
		mouseShowDelay            : 500     , // (milliseconds)
		posDlt                    :   1     , // (seconds)
		opedDlt                   :  85     , // (seconds)
		volDlt                    :   0.04  , // (range:[0,1])
		fontSize                  :   0.0527, // 1-based percent of video height to use for subtitle font size (range:[0,1])
		subtitleRaise             :   0.045 , // 1-based percent of video height to use for space between subtitles and video bottom (range:[0,1])
		subtitleContainerSelector : "#rmpPlayer>#player-override-event-mask>.rmp-content>.rmp-cc-area",
		clutterAllSelector        : "#rmpPlayer>#player-override-event-mask>:not(.rmp-content)",
		videoSelector             : "#rmpPlayer>#player-override-event-mask>.rmp-content>video.rmp-video",
		controlFocusSelector      : "#rmpPlayer",
		removeExistingStyle : function(){
			var elL = p.qda(p.doc,"style");
			for (var elLI = 0,elLC = elL.length; elLI < elLC; elLI++){var el = elL[elLI];
				if (el.innerHTML.includes(".rmp-cc-cue")){
					el.parentNode.removeChild(el);}}},
		//----------------------------------------
		// video element
		elv : null,
		// subtitle element, the highest parent
		els : null,
		// control element, determined by their service
		elc : null,
		// control mask element
		elm : null,
		// visibility state for clutter
		vis : false,
		// visibility state for subtitles
		visSubtitle : true,
		// height previous
		h : 0,
		// the actual height of the displayed video, excluding any black gaps
		hVideo : 0,
		// height of the potential black gap at the bottom of the screen
		bottomGap : 0,
		// whether to temporarily show the mouse around the time of mouse movement even if it's hidden
		mouseShowF : false,
		//
		mouseShowDelayHandle : null,
		// generate style text
		gst : function(){
			return ""
			+"@import url('https://fonts.googleapis.com/css?family=Open+Sans:700');"
			// !!! generalize this to be the leaf node, then all other nodes, regardless of actual count (there are some complex details though...)
			+".player-override-subtitle {bottom:unset !important;width:100% !important;height:100% !important;}" // respect display:none for subtitle beats
			+".player-override-subtitle>* {all:unset !important;width:100% !important;height:calc(100% - "+(this.bottomGap + (this.hVideo * this.subtitleRaise))+"px) !important;"
				+"display:flex !important;"
				+"flex-direction:column !important;"
				+"justify-content:flex-end !important;}"
			+".player-override-subtitle>*>* {all:unset !important;width:100% !important;height:unset !important;}"
			+".player-override-subtitle>*>*>* {all:unset !important;width:100% !important;height:unset !important;}"
			+".player-override-subtitle>*>*>*>* {"
				+"width:100% !important;"
				+"height:auto !important;"
				+"font-family:'Open Sans',sans-serif !important;"
				+"line-height:1.2em !important;"
				+"letter-spacing:-0.025em !important;"
				+"font-size:"+(this.hVideo * this.fontSize)+"px;"
				+"font-weight:700 !important;"
				+"color:white !important;"
				+"background-color:transparent !important;"
				+"text-stroke:0em black !important;"
				+"-webkit-text-stroke:0em black !important;"
				+"text-shadow:0px 0px 0.2em black,0px 0px 0.2em black,0px 0px 0.2em black,0px 0px 0.2em black,0px 0px 0.2em black,0px 0px 0.2em black,0px 0px 0.2em black,0px 0px 0.2em black,0px 0px 0.2em black,0px 0px 0.2em black,0px 0px 0.2em black,0px 0px 0.2em black !important;}"
			+(this.vis ? "" : ".player-override-hidden {display:none !important;}")
			+(this.visSubtitle ? "" : ".player-override-subtitle {display:none !important;}")
			+((this.vis || this.mouseShowF) ? "" : "* {cursor:none !important;}")
			;},
		// assert style
		ast : function(){this.qd(this.doc,"#player-override-style").textContent = p.gst();},
		//
		rescanElv : function(){
			var elv = this.qd(this.doc,this.videoSelector);
			if (elv === null || this.elv === elv){return;} // fail-fast
			this.elv = elv;},
		//
		rescanElc : function(){
			var elc = this.controlFocusSelector === null ? this.doc : this.qd(this.doc,this.controlFocusSelector);
			if (elc === null || this.elc === elc){return;} // fail-fast
			this.elc = elc;
			
			// transfer children from controls to mask
			this.elm = document.createElement("div");
			this.elm.id = "player-override-event-mask";
			this.elm.style = "width:100%;height:100%;";
			this.elm.setAttribute("tabindex","0");
			while (this.elc.childNodes.length > 0) {
				this.elm.appendChild(this.elc.childNodes[0]);}
			this.elc.appendChild(this.elm);
			
			// mousemove will temporarily show mouse if it's hidden
			this.elm.addEventListener("mousemove",(function(p){return function(ev){
				p.mouseShowF = true;
				p.ast();
				clearTimeout(p.mouseShowDelayHandle);
				p.mouseShowDelayHandle = setTimeout((function(p){return function(){p.mouseShowF = false;p.ast();};})(p),p.mouseShowDelay);};})(this));
			
			// shortcuts
			// [!] assumes your player already has a satisfactory:
			//     L> [f] toggle fullscreen
			//     L> [space] play/pause
			this.elm.addEventListener("keydown",(function(p){return function(ev){
				switch (ev.keyCode){default:;
					break;case p.kye.l    : p.evb(ev);p.elv.currentTime -= p.posDlt;
					break;case p.kye.r    : p.evb(ev);p.elv.currentTime += p.posDlt;
					break;case p.kye.s    : p.evb(ev);p.elv.currentTime += p.opedDlt;
					break;case p.kye.u    : p.evb(ev);if (p.elv.volume >= 1 - p.volDlt){p.elv.volume = 1;}else{p.elv.volume += p.volDlt;}
					break;case p.kye.d    : p.evb(ev);if (p.elv.volume <= 0 + p.volDlt){p.elv.volume = 0;}else{p.elv.volume -= p.volDlt;}
					break;case p.kye["0"] : p.evb(ev);p.elv.playbackRate =  1.0;
					break;case p.kye["1"] : p.evb(ev);p.elv.playbackRate =  1.1;
					break;case p.kye["2"] : p.evb(ev);p.elv.playbackRate =  1.2;
					break;case p.kye["3"] : p.evb(ev);p.elv.playbackRate =  1.3;
					break;case p.kye["4"] : p.evb(ev);p.elv.playbackRate =  1.4;
					break;case p.kye["5"] : p.evb(ev);p.elv.playbackRate =  1.5;
					break;case p.kye["6"] : p.evb(ev);p.elv.playbackRate =  1.6;
					break;case p.kye["7"] : p.evb(ev);p.elv.playbackRate =  1.7;
					break;case p.kye["8"] : p.evb(ev);p.elv.playbackRate =  1.8;
					break;case p.kye["9"] : p.evb(ev);p.elv.playbackRate =  1.9;}
				if (ev.shiftKey){
					switch (ev.keyCode){default:;
						break;case p.kye.h : p.evb(ev);}}
				else{
					switch (ev.keyCode){default:;
						break;case p.kye.h : p.evb(ev);}}};})(this),true);
			this.elm.addEventListener("keyup",(function(p){return function(ev){
				switch (ev.keyCode){default:;
					break;case p.kye.l    : p.evb(ev);
					break;case p.kye.r    : p.evb(ev);
					break;case p.kye.s    : p.evb(ev);
					break;case p.kye.u    : p.evb(ev);
					break;case p.kye.d    : p.evb(ev);
					break;case p.kye["0"] : p.evb(ev);
					break;case p.kye["1"] : p.evb(ev);
					break;case p.kye["2"] : p.evb(ev);
					break;case p.kye["3"] : p.evb(ev);
					break;case p.kye["4"] : p.evb(ev);
					break;case p.kye["5"] : p.evb(ev);
					break;case p.kye["6"] : p.evb(ev);
					break;case p.kye["7"] : p.evb(ev);
					break;case p.kye["8"] : p.evb(ev);
					break;case p.kye["9"] : p.evb(ev);}
				if (ev.shiftKey){
					switch (ev.keyCode){default:;
						break;case p.kye.h : p.evb(ev);p.visSubtitle = !p.visSubtitle;p.ast();}}
				else{
					switch (ev.keyCode){default:;
						break;case p.kye.h : p.evb(ev);p.vis = !p.vis;p.ast();}}};})(this),true);},
		//
		rescanEls : function(){
			var els = this.subtitleContainerSelector === null ? this.doc : this.qd(this.doc,this.subtitleContainerSelector);
			if (els === null || this.els === els){return;} // fail-fast
			this.els = els;
			this.els.classList.add("player-override-subtitle");},
		
		// event-block
		evb : function(ev){ev.stopImmediatePropagation();ev.stopPropagation();ev.preventDefault();},
		// key enun
		kye : {_:32,l:37,r:39,u:38,d:40,h:72,f:70,s:83,0:48,1:49,2:50,3:51,4:52,5:53,6:54,7:55,8:56,9:57},
		// query selector downward
		qd  : function(elP,s){return elP.querySelector(s);},
		// query selector downward all
		qda : function(elP,s){return elP.querySelectorAll(s);},
	};
	p.doc = document;
	p.rescanElv();setInterval((function(p){return function(){p.rescanElv();};})(p),100);
	p.rescanElc();setInterval((function(p){return function(){p.rescanElc();};})(p),100);
	p.rescanEls();setInterval((function(p){return function(){p.rescanEls();};})(p),100);
	
	// check for resizes occasionally
	setInterval((function(p){return function(){
		if (p.elv === null){return;} // fail-fast
		if (p.h !== p.elv.clientHeight){p.h = p.elv.clientHeight;
			var wMultN = p.elv.clientWidth  / p.elv.videoWidth ;
			var hMultN = p.elv.clientHeight / p.elv.videoHeight;
			p.hVideo = p.elv.videoHeight * Math.min(wMultN,hMultN);
			p.bottomGap = (p.elv.clientHeight - p.hVideo) / 2;
			p.ast();}};})(p),100);
	
	// tag the clutter
	var elL = p.qda(p.doc,p.clutterAllSelector);
	for (var elLI = 0,elLC = elL.length; elLI < elLC; elLI++){var el = elL[elLI];
		el.classList.add("player-override-hidden");}
	
	p.removeExistingStyle();
	
	// assert style
	var el = document.createElement("style");
	el.id = "player-override-style";
	p.doc.head.appendChild(el);
	p.ast();
})();