(function (){
	"use strict"

	var defaultSettings = { // настройки по умолчанию
		maxWidth : "600",
		maxHeight : "400",
		minWidth : "500",
		minHeight : "300"
	}

	Popup.prototype.show = function (){ // показать объект
		return document.body.appendChild(this.popup);
	}

	Popup.prototype.hide = function (){ // спрятать и убрать объект
		var elem = document.querySelector(".popup_overlay");
		elem.style.display = "none";
	}

	function exportModule(scope, name, value){ //экспорт конструктора модуля на уровень window
		scope[name] = value;
	}

	function getClientWidthOrHeight(expression){//считывание ширины или высоты body
		switch (expression.toLowerCase()) {
   			case "height":
				return (document.compatMode === 'CSS1Compat' && !window.opera) ? document.documentElement.clientHeight : document.body.clientHeight;
	      		break;
	   		case "width":
				return (document.compatMode === 'CSS1Compat' && !window.opera) ? document.documentElement.clientWidth : document.body.clientWidth;
	      		break;
		}
	}

	function chekOptions(obj){ //проверка объекта настроек
		return Object.prototype.toString.call(obj) === "[object Object]";
	}

	function processingOptions(settings, wrapper){ //распарсиваем настройки и устанавливаем их для контента и обертки контента
		this.node.style.maxWidth = settings.maxWidth + "px";
		this.node.style.maxHeight = settings.maxHeight + "px";
		this.node.style.minWidth = settings.minWidth + "px";
		this.node.style.minHeight = settings.minHeight + "px";

		wrapper.style.minWidth = (parseInt(settings.minWidth,10) + 30) + "px";
		wrapper.style.minHeight = (parseInt(settings.minHeight,10) + 30) + "px";
		wrapper.style.maxWidth = (parseInt(settings.maxWidth,10) + 30) + "px";
		wrapper.style.maxHeight = (parseInt(settings.maxHeight,10) + 30) + "px";
	}

	function bind(obj, event_name, handler, el){
		var handler_wrapper = function (event){
			event = event || window.event;
			if (!event.target && event.srcElement){
				event.target = event.srcElement;
			}
			return handler.call(obj, event, el);
		};

		if (obj.addEventListener) {
			obj.addEventListener(event_name, handler_wrapper, false);
		} else if (obj.attachEvent) {
			obj.attachEvent('on' + event_name, handler_wrapper);
		}
		return handler_wrapper;
	}

	function top_walker(node, test_func, last_parent){
		while (node && node !== last_parent){
			if (test_func(node)){
				return node;
			}
			node = node.parentNode;
		}
	}

	function get_node(node){
		return top_walker(node, function (node){
			return node.getAttribute("class") === "closet_popup" || "popup_overlay" ||  "popup_wrapper";
		});
	}

	function init(settings){ // инициализация попап
		var overlay = document.createElement("div"); // создаем слой затемнения
			overlay.setAttribute("class", "popup_overlay");

		var wrapper = document.createElement("div");
			wrapper.setAttribute("class", "popup_wrapper");

		var closet = document.createElement("div");
			closet.setAttribute("class", "closet_popup");
			
		wrapper.appendChild(closet);

		if (settings && chekOptions(settings)){ //проверяем какие настройки зашли
			processingOptions.call(this,settings, wrapper);
		} else {
			processingOptions.call(this,defaultSettings, wrapper);
		}

		wrapper.appendChild(this.node);

		overlay.appendChild(wrapper);

		this.popup = overlay;

		bind(this.popup, 'click', function (event){
			var node;

			node = get_node(event.target);
			if (node.getAttribute("class") === "closet_popup" || node.getAttribute("class") === "popup_overlay") {
				this.style.display = "none";
			}
		});

		bind(document, 'keyup', function (event, el){
			var keycode;

			if (event.keyCode){
				keycode = event.keyCode; // IE
			}else if(event.which){
				keycode = event.which; // все браузеры
			}

			if (el && keycode === 27){
				el.style.display = "none";
			}
		}, this.popup);

		return  this.popup;// весь попап
	}

	function Popup(node, options){
		var nodeObj = document.querySelector(node.toString());//устанавливаем последний узел

		this.node =  nodeObj.cloneNode(true);

		this.options = options || defaultSettings;

		var elemClass = this.node.getAttribute("class"); //получаем класс узла
	
		if (elemClass === "popup"){ //проверяем существование соответствующего класса, если нет - выходим
			this.node.setAttribute("class",  elemClass + " popup_content"); //добавляем класс
		} else {
			return false;
		}

		if (chekOptions(this.options)){ // если есть объект настроек
			init.call(this,this.options);	// настраиваем и инициализируем попап
		} else {
			init.call();	//вызываем инициализацию с default настройками
		}
	}

	exportModule(window, "Popup", Popup);	
})();