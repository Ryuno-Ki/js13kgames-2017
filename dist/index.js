var game=function(t){"use strict";function e(t,e){if(!t)return o;switch(e.type){case r.moveDown:case r.moveLeft:case r.moveRight:case r.moveUp:return Object.assign({},t,e.payload);default:return t}}function a(t,e){if(!t)return h;switch(e.type){case u.add:case u.randomiseGate:case u.setRadius:return Object.assign({},t,e.payload);default:return t}}class s{static create(t){const e=s.createCanvas(t),a=window.document.getElementById("app");a.appendChild(e);const n=new AudioContext,r=s.createMuteButton(n);return s.createBackgroundNoise(n).connect(r.gain),r.gain.connect(n.destination),a.appendChild(r.button),e}static createCanvas(t){const e=window.document.createElement("canvas");return e.setAttribute("id",t),e.setAttribute("height",`${s.HEIGHT}px`),e.setAttribute("width",`${s.WIDTH}px`),e}static createMuteButton(t){const e=window.document.createElement("label"),a=window.document.createTextNode("Volume:"),s=window.document.createElement("input");s.setAttribute("type","range"),s.setAttribute("min",0),s.setAttribute("max",1),s.setAttribute("step",.1),s.innerHTML="Mute",s.value=.5*Math.random();const n=t.createGain();return s.addEventListener("change",t=>{t.preventDefault(),n.gain.value=parseFloat(t.target.value)},!1),e.appendChild(a),e.appendChild(s),{button:e,gain:n}}static createBackgroundNoise(t){return(()=>{let e=0;const a=t.createScriptProcessor(4096,1,1);return a.onaudioprocess=(t=>{const a=t.outputBuffer.getChannelData(0);for(let t=0;t<4096;t++){let s=2*Math.random()-1;a[t]=(e+.02*s)/1.02,e=a[t],a[t]*=3.5}}),a})()}static get GATESIZE(){return 1.05*s.USERSIZE}static get HEIGHT(){return Math.min(window.innerHeight,window.innerWidth)}static get USERSIZE(){return s.WALLDISTANCE/3}static get USERROTATION(){const t=window.document.getElementById("angle");if(null===t)return console.log("Fallback USERROTATION"),.02*n.euclideanDistance(s.HEIGHT,s.WIDTH);const e=parseInt(t.value,10);return n.mapDegreeToRadians(e)}static get USERVELOCITY(){return 3}static get WALLDISTANCE(){return.06*(s.HEIGHT+s.WIDTH)/2}static get WIDTH(){return Math.min(window.innerHeight,window.innerWidth)}render(t){const e=this.context,a=t.walls.walls;e.clearRect(0,0,s.WIDTH,s.HEIGHT),a.forEach(t=>{this.renderWall(t)}),this.renderHero(t.user)}renderHero(t){const e=.9*(2*Math.PI),a=s.USERSIZE,r=this.context,i=n.mapPolarToCartesian({r:t.radius,phi:t.angle}),o=n.coordinationSystemToVertex(i.x,i.y),c=o.p,d=o.q;r.beginPath(),r.arc(c,d,a,0,e),r.fill()}renderWall(t){const e=s.WIDTH/2,a=s.HEIGHT/2,n=this.context,r=t.gate.end,i=t.gate.start,o=t.radius;n.beginPath(),n.arc(e,a,o,r,i),n.stroke()}constructor(t){this.element=s.create(t),this.context=this.element.getContext("2d")}}class n{static coordinationSystemToCenter(t,e){return{x:t-s.WIDTH/2,y:e-s.HEIGHT/2}}static coordinationSystemToVertex(t,e){return{p:t+s.WIDTH/2,q:e+s.HEIGHT/2}}static euclideanDistance(t,e){return Math.sqrt(t*t+e*e)}static mapCartesianToPolar(t){const e=t.x,a=t.y;return{r:Math.sqrt(Math.pow(e,2)+Math.pow(a,2)),phi:Math.atan2(a,e)}}static mapDegreeToRadians(t){return t*Math.PI/180}static mapPolarToCartesian(t){const e=t.phi,a=t.r;return{x:a*Math.cos(e),y:a*Math.sin(e)}}static mapRadiansToDegree(t){return 180*t/Math.PI}static normaliseAngle(t){const e=2*Math.PI;return t<0?(t+e)%e:t%e}}class r{static get moveDown(){return"HERO_MOVES_DOWN"}static get moveLeft(){return"HERO_MOVES_LEFT"}static get moveRight(){return"HERO_MOVES_RIGHT"}static get moveUp(){return"HERO_MOVES_UP"}}class i{static moveDown(t){const e=t.distance;return{type:r.moveDown,payload:{radius:t.radius-e}}}static moveLeft(t){const e=n.mapDegreeToRadians(3*t.distance);return{type:r.moveLeft,payload:{angle:t.angle-e}}}static moveRight(t){const e=n.mapDegreeToRadians(3*t.distance);return{type:r.moveRight,payload:{angle:t.angle+e}}}static moveUp(t){const e=t.distance;return{type:r.moveUp,payload:{radius:t.radius+e}}}}const o={angle:0,radius:0};class c{static createStore(t,e){const a=t(e,{type:"DUMMY",payload:{}}),s=Object.assign({},a,e);return new c(t,s)}static reduceReducers(t){return(e,a)=>{const s={};return Object.keys(t).forEach(n=>{const r=(0,t[n])(e?e[n]:null,a);s[n]=r}),s}}dispatch(t){const e=this.getState(),a=this._reducer(e,t);this._state=a,this._subscribers.forEach(t=>{t(a)})}getState(){return this._state}subscribe(t){this._subscribers.push(t);return()=>this._subscribers}constructor(t,e){const a=e||{};this._state=Object.assign({},a),this._reducer=t,this._subscribers=[]}}class d{handleTouchMove(t){if(!this.xDown||!this.yDown)return;const e=this.handlers,a=t.touches[0].clientX,s=t.touches[0].clientY;this.xDiff=this.xDown-a,this.yDiff=this.yDown-s,Math.abs(this.xDiff)>Math.abs(this.yDiff)?this.xDiff>0?e.onLeft(this.xDiff):e.onRight(this.xDiff):this.yDiff>0?e.onUp(this.yDiff):e.onDown(this.yDiff),this.xDown=null,this.yDown=null}onTouchMove(t){this.handleTouchMove(t)}onTouchStart(t){this.xDown=t.touches[0].clientX,this.yDown=t.touches[0].clientY}run(){const t=this,e=t.onTouchMove;this.element.addEventListener("touchmove",e.bind(t),!1)}constructor(t,e){this.xDown=null,this.yDown=null,this.element=t,this.element.addEventListener("touchstart",this.onTouchStart.bind(this),!1);const a=e.onDown,s=e.onLeft,n=e.onRight,r=e.onUp;this.handlers={onDown:a,onLeft:s,onRight:n,onUp:r}}}class u{static get add(){return"WALL_ADD"}static get randomiseGate(){return"WALL_RANDOMISE_GATE"}static get setRadius(){return"WALL_SET_RADIUS"}}class l{static _getRandomStart(){return 2*Math.PI*Math.random()}static _getRandomEnd(t,e){return n.normaliseAngle(t+e)}static add(t){const e=t.walls.slice(),a=Object.assign({},l.randomiseGate(t.width).payload,l.setRadius(t.radius).payload),s={walls:e.concat(a)};return Object.assign({},t,{type:u.add,payload:s})}static randomiseGate(t){const e=l._getRandomStart(),a=l._getRandomEnd(e,t);return{type:u.randomiseGate,payload:{gate:{start:e,end:a}}}}static setRadius(t){return{type:u.setRadius,payload:{radius:t}}}}const h={walls:[{radius:s.WALLDISTANCE,gate:{end:s.GATESIZE,start:0}}]};class g{static get KEYMAP(){return{LEFT:37,UP:38,RIGHT:39,DOWN:40}}static notifyUser(){window.document.body.classList.add("flash"),setTimeout(()=>{window.document.body.classList.remove("flash")},500)}static compareAngle(t,e){const a=t.radius+s.USERSIZE,r=s.WALLDISTANCE;return e.filter(t=>!(a-t.radius>r)&&!(t.radius-a>r)).map(e=>{const a=n.normaliseAngle(e.gate.start),s=n.normaliseAngle(e.gate.end),r=n.normaliseAngle(t.angle);return!(a<r&&s>r)}).reduce((t,e)=>t||e)}static compareRadii(t,e){const a=t.radius+s.USERSIZE,n=s.WALLDISTANCE;return e.map(t=>t.radius).filter(t=>!(a-t>n)&&!(t-a>n)).map(t=>!(a+s.USERSIZE<t)&&!(a-s.USERSIZE>t)).reduce((t,e)=>t||e)}static detectCollision(t){const e=t.user,a=t.walls.walls,s=g.compareAngle(e,a),n=g.compareRadii(e,a);return s&&n}static update(t,e){const a=e.getState();g.detectCollision(a)&&g.notifyUser(),t.render(e.getState())}static _buildHeroPayload(t,e){return Object.assign({},t.user,{distance:e})}static _getMaxLevel(){const t=window.document.getElementsByTagName("input")[0],e=10*parseFloat(t.value);return 3+parseInt(e,10)}init(){this.store.dispatch({},{type:"INIT",payload:{}});const t=g._getMaxLevel();let e,a,n;for(let r=2;r<t;r++)n={walls:a=(e=this.store.getState()).walls.walls,radius:r*s.WALLDISTANCE,width:s.GATESIZE},this.store.dispatch(l.add(n));this.registerArrowKeyHandlers(),this.registerSwipeHandlers(),e=this.store.getState(),n=g._buildHeroPayload(e,5),this.store.dispatch(i.moveUp(n))}onKeyDown(t){const e=t.keyCode,a=g.KEYMAP,s=this.store,n=s.getState(),r=g._buildHeroPayload(n,5);switch(e){case a.LEFT:s.dispatch(i.moveLeft(r)),t.preventDefault();break;case a.UP:s.dispatch(i.moveUp(r)),t.preventDefault();break;case a.RIGHT:s.dispatch(i.moveRight(r)),t.preventDefault();break;case a.DOWN:s.dispatch(i.moveDown(r)),t.preventDefault();break;default:console.log("Received keyCode",t.keyCode)}}registerArrowKeyHandlers(){const t=this,e=this.onKeyDown;window.document.body.addEventListener("keydown",e.bind(t),!1)}registerSwipeHandlers(){const t=this.store,e={onDown:e=>{const a=t.getState(),s=g._buildHeroPayload(a,e);t.dispatch(i.moveDown(s))},onLeft:e=>{const a=t.getState(),s=g._buildHeroPayload(a,e);t.dispatch(i.moveLeft(s))},onRight:e=>{const a=t.getState(),s=g._buildHeroPayload(a,e);t.dispatch(i.moveRight(s))},onUp:e=>{const a=t.getState(),s=g._buildHeroPayload(a,e);t.dispatch(i.moveUp(s))}};new d(this.world.element,e).run()}constructor(t){const n={user:e,walls:a},r=c.reduceReducers(n);this.store=c.createStore(r),this.world=new s(t),this.store.subscribe(()=>{g.update(this.world,this.store)})}}return new g("game").init(),t.Game=g,t}({});
