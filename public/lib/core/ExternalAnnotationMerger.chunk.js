/** Notice * This file contains works from many authors under various (but compatible) licenses. Please see core.txt for more information. **/
(function(){(window.wpCoreControlsBundle=window.wpCoreControlsBundle||[]).push([[7],{443:function(ia,da,e){e.r(da);var ca=e(1),y=e(470),ha=e(471),ea;(function(e){e[e.EXTERNAL_XFDF_NOT_REQUESTED=0]="EXTERNAL_XFDF_NOT_REQUESTED";e[e.EXTERNAL_XFDF_NOT_AVAILABLE=1]="EXTERNAL_XFDF_NOT_AVAILABLE";e[e.EXTERNAL_XFDF_AVAILABLE=2]="EXTERNAL_XFDF_AVAILABLE"})(ea||(ea={}));ia=function(){function e(e){this.aa=e;this.state=ea.EXTERNAL_XFDF_NOT_REQUESTED}e.prototype.Cba=function(){var e=this;return function(w,y,r){return Object(ca.b)(e,
void 0,void 0,function(){var e,n,f,z,x,aa,ba,da=this,fa;return Object(ca.d)(this,function(h){switch(h.label){case 0:if(this.state!==ea.EXTERNAL_XFDF_NOT_REQUESTED)return[3,2];e=this.aa.getDocument().ls();return[4,this.R$(e)];case 1:n=h.ea(),f=this.V5(n),this.UH=null!==(fa=null===f||void 0===f?void 0:f.parse())&&void 0!==fa?fa:null,this.state=null===this.UH?ea.EXTERNAL_XFDF_NOT_AVAILABLE:ea.EXTERNAL_XFDF_AVAILABLE,h.label=2;case 2:if(this.state===ea.EXTERNAL_XFDF_NOT_AVAILABLE)return r(w),[2];z=new DOMParser;
x=z.parseFromString(w,"text/xml");y.forEach(function(e){da.merge(x,da.UH,e-1)});aa=new XMLSerializer;ba=aa.serializeToString(x);r(ba);return[2]}})})}};e.prototype.KL=function(e){this.R$=e};e.prototype.qe=function(){this.UH=void 0;this.state=ea.EXTERNAL_XFDF_NOT_REQUESTED};e.prototype.V5=function(e){return e?Array.isArray(e)?new y.a(e):"string"!==typeof e?null:(new DOMParser).parseFromString(e,"text/xml").querySelector("xfdf > add")?new y.a(e):new ha.a(e):null};e.prototype.merge=function(e,w,y){var r=
this;0===y&&(this.Wda(e,w.gp),this.Yda(e,w.AH));var h=w.ca[y];h&&(this.Zda(e,h.$m),this.aea(e,h.vZ,w.Uv),this.$da(e,h.page,y),this.Xda(e,h.vR));h=this.aa.Pb();if(y===h-1){var n=w.Uv;Object.keys(n).forEach(function(f){n[f].iJ||r.gV(e,f,n[f])})}};e.prototype.Wda=function(e,w){null!==w&&(e=this.iv(e),this.vq(e,"calculation-order",w))};e.prototype.Yda=function(e,w){null!==w&&(e=this.iv(e),this.vq(e,"document-actions",w))};e.prototype.Zda=function(e,w){var y=this,r=this.hv(e.querySelector("xfdf"),"annots");
Object.keys(w).forEach(function(e){y.vq(r,'[name="'+e+'"]',w[e])})};e.prototype.aea=function(e,w,y){var r=this;if(0!==w.length){var h=this.iv(e);w.forEach(function(n){var f=n.getAttribute("field"),w=y[f];w&&(r.gV(e,f,w),r.vq(h,"null",n))})}};e.prototype.gV=function(e,w,y){var r=this.iv(e);null!==y.EB&&this.vq(r,'ffield [name="'+w+'"]',y.EB);e=this.hv(e.querySelector("xfdf"),"fields");w=w.split(".");this.XK(e,w,0,y.value);y.iJ=!0};e.prototype.$da=function(e,w,y){null!==w&&(e=this.iv(e),e=this.hv(e,
"pages"),this.vq(e,'[number="'+(y+1)+'"]',w))};e.prototype.Xda=function(e,w){Object.keys(w).forEach(function(w){(w=e.querySelector('annots [name="'+w+'"]'))&&w.parentElement.removeChild(w)})};e.prototype.XK=function(e,w,y,r){if(y===w.length)w=document.createElementNS("","value"),w.textContent=r,this.vq(e,"value",w);else{var h=w[y];this.hv(e,'[name="'+h+'"]',"field").setAttribute("name",h);e=e.querySelectorAll('[name="'+h+'"]');1===e.length?this.XK(e[0],w,y+1,r):(h=this.H9(e),this.XK(y===w.length-
1?h:this.Jka(e,h),w,y+1,r))}};e.prototype.H9=function(e){for(var w=null,y=0;y<e.length;y++){var r=e[y];if(0===r.childElementCount||1===r.childElementCount&&"value"===r.children[0].tagName){w=r;break}}return w};e.prototype.Jka=function(e,w){for(var y=0;y<e.length;y++)if(e[y]!==w)return e[y];return null};e.prototype.vq=function(e,w,y){w=e.querySelector(w);null!==w&&e.removeChild(w);e.appendChild(y)};e.prototype.iv=function(e){var w=e.querySelector("pdf-info");if(null!==w)return w;w=this.hv(e.querySelector("xfdf"),
"pdf-info");w.setAttribute("xmlns","http://www.pdftron.com/pdfinfo");w.setAttribute("version","2");w.setAttribute("import-version","4");return w};e.prototype.hv=function(e,w,y){var r=e.querySelector(w);if(null!==r)return r;r=document.createElementNS("",y||w);e.appendChild(r);return r};return e}();da["default"]=ia},455:function(ia,da){ia=function(){function e(){}e.prototype.bA=function(e){var y={gp:null,AH:null,Uv:{},ca:{}};e=(new DOMParser).parseFromString(e,"text/xml");y.gp=e.querySelector("pdf-info calculation-order");
y.AH=e.querySelector("pdf-info document-actions");y.Uv=this.Rea(e);y.ca=this.cfa(e);return y};e.prototype.Rea=function(e){var y=e.querySelector("fields");e=e.querySelectorAll("pdf-info > ffield");if(null===y&&null===e)return{};var ca={};this.s3(ca,y);this.q3(ca,e);return ca};e.prototype.s3=function(e,y){if(null!==y&&y.children){for(var ca=[],da=0;da<y.children.length;da++){var fa=y.children[da];ca.push({name:fa.getAttribute("name"),element:fa})}for(;0!==ca.length;)for(y=ca.shift(),da=0;da<y.element.children.length;da++)fa=
y.element.children[da],"value"===fa.tagName?e[y.name]={value:fa.textContent,EB:null,iJ:!1}:fa.children&&ca.push({name:y.name+"."+fa.getAttribute("name"),element:fa})}};e.prototype.q3=function(e,y){y.forEach(function(y){var ca=y.getAttribute("name");e[ca]?e[ca].EB=y:e[ca]={value:null,EB:y,iJ:!1}})};e.prototype.cfa=function(e){var y=this,ca={};e.querySelectorAll("pdf-info widget").forEach(function(e){var da=parseInt(e.getAttribute("page"),10)-1;y.CC(ca,da);ca[da].vZ.push(e)});e.querySelectorAll("pdf-info page").forEach(function(e){var da=
parseInt(e.getAttribute("number"),10)-1;y.CC(ca,da);ca[da].page=e});this.$S(e).forEach(function(e){var da=parseInt(e.getAttribute("page"),10),ba=e.getAttribute("name");y.CC(ca,da);ca[da].$m[ba]=e});this.MS(e).forEach(function(e){var da=parseInt(e.getAttribute("page"),10);e=e.textContent;y.CC(ca,da);ca[da].vR[e]=!0});return ca};e.prototype.CC=function(e,y){e[y]||(e[y]={$m:{},vR:{},vZ:[],page:null})};return e}();da.a=ia},470:function(ia,da,e){var ca=e(1),y=e(0);e.n(y);ia=function(e){function da(y){var ba=
e.call(this)||this;ba.t9=Array.isArray(y)?y:[y];return ba}Object(ca.c)(da,e);da.prototype.parse=function(){var e=this,ba={gp:null,AH:null,Uv:{},ca:{}};this.t9.forEach(function(w){ba=Object(y.merge)(ba,e.bA(w))});return ba};da.prototype.$S=function(e){var y=[];e.querySelectorAll("add > *").forEach(function(e){y.push(e)});e.querySelectorAll("modify > *").forEach(function(e){y.push(e)});return y};da.prototype.MS=function(e){return e.querySelectorAll("delete > *")};return da}(e(455).a);da.a=ia},471:function(ia,
da,e){var ca=e(1);ia=function(e){function y(y){var ca=e.call(this)||this;ca.u9=y;return ca}Object(ca.c)(y,e);y.prototype.parse=function(){return this.bA(this.u9)};y.prototype.$S=function(e){return e.querySelectorAll("annots > *")};y.prototype.MS=function(){return[]};return y}(e(455).a);da.a=ia}}]);}).call(this || window)
