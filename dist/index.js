var game=function(t){"use strict";function e(t,e){if(!t)return a;switch(e.type){case i.moveDown:case i.moveLeft:case i.moveRight:case i.moveUp:return Object.assign({},t,e.payload);default:return t}}function n(t,e){if(!t)return h;switch(e.type){case u.randomiseGate:case u.setRadius:return Object.assign({},t,e.payload);default:return t}}class i{static get moveDown(){return"HERO_MOVES_DOWN"}static get moveLeft(){return"HERO_MOVES_LEFT"}static get moveRight(){return"HERO_MOVES_RIGHT"}static get moveUp(){return"HERO_MOVES_UP"}}class s{static moveDown(t){return{type:i.moveDown,payload:{radius:-t}}}static moveLeft(t){return{type:i.moveLeft,payload:{angle:-t}}}static moveRight(t){return{type:i.moveRight,payload:{angle:t}}}static moveUp(t){return{type:i.moveUp,payload:{radius:t}}}}const a={angle:0,radius:0};class r{static createStore(t,e){const n=t(e,{type:"DUMMY",payload:{}}),i=Object.assign({},n,e);return new r(t,i)}static reduceReducers(t){return(e,n)=>{const i={};return Object.keys(t).forEach(s=>{const a=(0,t[s])(e?e[s]:null,n);i[s]=a}),i}}dispatch(t){const e=this.getState(),n=this._reducer(e,t);this._state=n,this._subscribers.forEach(t=>{t(n)})}getState(){return this._state}subscribe(t){this._subscribers.push(t);return()=>this._subscribers}constructor(t,e){const n=e||{};this._state=Object.assign({},n),this._reducer=t,this._subscribers=[]}}class o{handleTouchMove(t){if(!this.xDown||!this.yDown)return;const e=this.handlers,n=t.touches[0].clientX,i=t.touches[0].clientY;this.xDiff=this.xDown-n,this.yDiff=this.yDown-i,Math.abs(this.xDiff)>Math.abs(this.yDiff)?this.xDiff>0?e.onLeft():e.onRight():this.yDiff>0?e.onUp():e.onDown(),this.xDown=null,this.yDown=null}onTouchMove(t){this.handleTouchMove(t)}onTouchStart(t){this.xDown=t.touches[0].clientX,this.yDown=t.touches[0].clientY}run(){const t=this,e=t.onTouchMove;this.element.addEventListener("touchmove",e.bind(t),!1)}constructor(t,e){this.xDown=null,this.yDown=null,this.element=t,this.element.addEventListener("touchstart",this.onTouchStart.bind(this),!1);const n=e.onDown,i=e.onLeft,s=e.onRight,a=e.onUp;this.handlers={onDown:n,onLeft:i,onRight:s,onUp:a}}}class c{static create(t){const e=c.createCanvas(t);window.document.body.appendChild(e);const n=c.createContainer(),i=c.createLevel(),s=c.createAngleInput();return n.appendChild(i),n.appendChild(s),window.document.body.appendChild(n),e}static createAngleInput(){const t=window.document.createElement("label"),e=window.document.createTextNode("Angle in degree"),n=window.document.createElement("input");return n.setAttribute("id","angle"),n.setAttribute("min","1"),n.setAttribute("type","number"),n.setAttribute("value","5"),t.appendChild(e),t.appendChild(n),t}static createCanvas(t){const e=window.document.createElement("canvas");return e.setAttribute("id",t),e.setAttribute("height",`${c.HEIGHT}px`),e.setAttribute("width",`${c.WIDTH}px`),e}static createContainer(){return window.document.createElement("div")}static createLevel(){const t=window.document.createElement("label"),e=window.document.createTextNode("Level"),n=window.document.createElement("input");return n.setAttribute("id","level"),n.setAttribute("min","1"),n.setAttribute("type","number"),n.setAttribute("value","5"),t.appendChild(e),t.appendChild(n),t}static get GATESIZE(){return.15}static get HEIGHT(){return Math.min(window.innerHeight,window.innerWidth)}static get USERSIZE(){return c.WALLDISTANCE/3}static get USERROTATION(){const t=window.document.getElementById("angle");if(null===t)return console.log("Fallback USERROTATION"),.02*d.euclideanDistance(c.HEIGHT,c.WIDTH);const e=parseInt(t.value,10);return d.mapDegreeToRadians(e)}static get USERVELOCITY(){return 3}static get WALLDISTANCE(){return.06*(c.HEIGHT+c.WIDTH)/2}static get WIDTH(){return Math.min(window.innerHeight,window.innerWidth)}static updateTimer(t){window.document.getElementById("elapsed").innerText=t}render(){this.context.clearRect(0,0,c.WIDTH,c.HEIGHT)}renderHero(t){const e=.9*(2*Math.PI),n=c.USERSIZE,i=this.context,s=t.x,a=t.y;i.fillStyle="black",i.beginPath(),i.arc(s,a,n,0,e),i.fill()}renderWall(t){const e=c.WIDTH/2,n=c.HEIGHT/2,i=this.context,s=t.endGate,a=t.radius,r=t.startGate;i.beginPath(),i.arc(e,n,a,s,r),i.stroke()}constructor(t){this.element=c.create(t),this.context=this.element.getContext("2d")}}class d{static coordinationSystemToCenter(t,e){return{x:t-c.WIDTH/2,y:e-c.HEIGHT/2}}static coordinationSystemToVertex(t,e){return{p:t+c.WIDTH/2,q:e+c.HEIGHT/2}}static euclideanDistance(t,e){return Math.sqrt(t*t+e*e)}static mapCartesianToPolar(t){const e=t.x,n=t.y;return{r:Math.sqrt(Math.pow(e,2)+Math.pow(n,2)),phi:Math.atan2(n,e)}}static mapDegreeToRadians(t){return t*Math.PI/180}static mapPolarToCartesian(t){const e=t.phi,n=t.r;return{x:n*Math.cos(e),y:n*Math.sin(e)}}static mapRadiansToDegree(t){return 180*t/Math.PI}static normaliseAngle(t){const e=2*Math.PI;return t<0?(t+e)%e:t%e}}class u{static get randomiseGate(){return"WALL_RANDOMISE_GATE"}static get setRadius(){return"WALL_SET_RADIUS"}}const h={radius:1,gate:{end:1,start:0}};window.requestAnimationFrame=window.requestAnimationFrame||(()=>null);class l{static get KEYMAP(){return{LEFT:37,UP:38,RIGHT:39,DOWN:40}}static notifyUser(){const t=(new Date).toISOString();console.log("Hit wall",t),window.document.body.classList.add("flash"),setTimeout(()=>{window.document.body.classList.remove("flash")},500)}static detectCollision(){return!1}draw(){const t=this.hero,e=this.walls;l.detectCollision(t,e)&&l.notifyUser(),this.world.render(t,e)}init(){const t=this,e=this.update;this.registerArrowKeyHandlers(),this.registerSwipeHandlers(),window.requestAnimationFrame(e.bind(t))}onKeyDown(t){const e=this.hero,n=t.keyCode,i=l.KEYMAP,s=this,a=this.update;switch(n){case i.LEFT:e.moveLeft(),t.preventDefault();break;case i.UP:e.moveUp(),t.preventDefault();break;case i.RIGHT:e.moveRight(),t.preventDefault();break;case i.DOWN:e.moveDown(),t.preventDefault();break;default:console.log("Received keyCode",t.keyCode)}window.requestAnimationFrame(a.bind(s))}registerArrowKeyHandlers(){const t=this,e=this.onKeyDown;window.document.body.addEventListener("keydown",e.bind(t),!1)}registerSwipeHandlers(){const t=this.hero,e=this,n=this.update,i={onDown:()=>{t.moveDown(),window.requestAnimationFrame(n.bind(e))},onLeft:()=>{t.moveLeft(),window.requestAnimationFrame(n.bind(e))},onRight:()=>{t.moveRight(),window.requestAnimationFrame(n.bind(e))},onUp:()=>{t.moveUp(),window.requestAnimationFrame(n.bind(e))}};new o(this.world.element,i).run()}update(t){const e=t-this.lastUpdateTimestamp,n=e<0,i=this,s=this.update;(e>60||n)&&(this.draw(),this.updateTimer(),window.requestAnimationFrame(s.bind(i)),this.lastUpdateTimestamp=t)}updateTimer(){const t=this.startTime,e=new Date,n=Math.round((e-t)/1e3);c.updateTimer(n)}constructor(t){const i={user:e,walls:n},a=r.reduceReducers(i);r.createStore(a).dispatch(s.moveUp),this.world=new c(t),this.startTime=new Date,this.lastUpdateTimestamp=Number(new Date),this.state={user:{angle:0,name:"Jane Doe",radius:0,timeElapsed:(new Date).toISOString()},walls:[{gate:{start:0,end:1},radius:0}],world:{height:c.HEIGHT,width:c.WIDTH}},this.walls=[]}}return new l("game").init(),t.Game=l,t}({});
