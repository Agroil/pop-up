//С версткой бок какой-то, не могу понять почему тег обжект перекрывает враппер попапа.
//вроде исправил логику работы, напиши свои комментарии. Хочу довести до ума этот плагин, хочу на своем сайте исползывать.


// podogrniy
// Насчет перекрытия флешом документа — ищи по словам https://www.google.com.ua/search?q=z-index+flash&ie=utf-8&oe=utf-8&aq=t&rls=org.mozilla:en-US:unofficial&client=firefox-aurora
// Зачем хранишь дефолтные значения в строках?
// Работать будет только с 8 ие (это просто контатация)
// Метод has_class будет возвращать неверные значения для элемента с классом "popup_overlay" : has_class('.popup_overlay', 'popup'); // true
// Опять про название функций (get_node). Из названия не понятно что она делает (какой именно нод возвращает)
// комментарии класса //"добавляем класс" бесполезные: они не несут никакой смысловой нагрузки. Лучше объяснить для чего ты добавляешь класс
// условие if (chekOptions(this.options)){ избыточно
// podogrniy[END]
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
		var handlerWrapper = function (event){
			event = event || window.event;
			if (!event.target && event.srcElement){
				event.target = event.srcElement;
			}
			return handler.call(obj, event, el);
		};

		if (obj.addEventListener) {
			obj.addEventListener(event_name, handlerWrapper, false);
		} else if (obj.attachEvent) {
			obj.attachEvent('on' + event_name, handlerWrapper);
		}
		return handlerWrapper;
	}

	function topWalker(node, test_func, last_parent){
		while (node && node !== last_parent){
			if (test_func(node)){
				return node;
			}
			node = node.parentNode;
		}
	}

	function howNodeClick(node){ // Что-то делает, что-то важное... Отлавливаем на каком элементе произошло событие и каким классом обладает этот элемент
		return topWalker(node, function (node){
			if (hasClass(node, "popup_overlay")){
				return true;
			}
			if(hasClass(node, "popup_wrapper")){
				return true;
			}
			if(hasClass(node, "closet_popup")){
				return true;
			}
			return false;
		});
	}

	function hasClass(node, className){// проверка существования соответсвующего класса
		try{
			var getClass = node.getAttribute("class");
			
			if (getClass && getClass.search(className) !== -1){
				return true;
			} else {
				return false;
			}
		} catch (err){
			console.log("Херня, узел надо передавать object HTMLDocument");
			return false;
		}
	}

	function init(settings){ // инициализация попап
		var overlay = document.createElement("div"); // создаем слой затемнения
			overlay.setAttribute("class", "popup_overlay");

		var wrapper = document.createElement("div"); // обертка
			wrapper.setAttribute("class", "popup_wrapper");

		var closet = document.createElement("div"); // кнопка закрытия попапа
			closet.setAttribute("class", "closet_popup");

		wrapper.appendChild(closet);

		if (settings){ //проверяем какие настройки зашли
			processingOptions.call(this,settings, wrapper);
		} else {
			processingOptions.call(this,defaultSettings, wrapper);
		}

		wrapper.appendChild(this.node);

		overlay.appendChild(wrapper);

		this.popup = overlay;

		bind(this.popup, 'click', function (event){
			var node;

			node = howNodeClick(event.target);
			if (hasClass(node, "closet_popup") || hasClass(node, "popup_overlay")) {
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

			if (el && keycode === 27){ // проверка на Esc
				el.style.display = "none";
			}
		}, this.popup);

		return  this.popup;// возвращаем весь попап в сборке
	}

	function Popup(nodeClass, options){ // конструктор
		var nodeObj = document.querySelector(nodeClass);//устанавливаем узел
		
		if (nodeObj.tagName === "OBJECT"){
			var param = document.createElement("param");
				param.setAttribute("name", "wmode");
				param.setAttribute("value", "opaque");
			nodeObj.insertBefore(param, nodeObj.lastChild);
		}

		this.node = nodeObj.cloneNode(true);

		this.options = options || defaultSettings;

		var elemClass = this.node.getAttribute("class"); //получаем класс узла

		if (elemClass.search(/popup/) !== -1){ //проверяем существование соответствующего класса, если нет - выходим
			this.node.setAttribute("class",  elemClass + " popup_content");
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


//TODO Loock it

	mmcore.AddDocLoadHandler(function() {
		"use strict"

			var defaultSettings = { // настройки по умолчанию
				maxWidth : "600",
				maxHeight : "400",
				minWidth : "500",
				minHeight : "300"
			}

			Popup.prototype.show = function (callback){ // показать объект
				if (callback){
					document.body.appendChild(this.popup);
					callback.apply(this.popup, arguments);
					
					return true;
				} else {
					return document.body.appendChild(this.popup);
				}
			}

			Popup.prototype.hide = function (){ // спрятать и убрать объект
				var elem = document.querySelector(".popup_overlay");
				elem.style.display = "none";
			}

			function exportModule(scope, name, value){ //экспорт конструктора модуля на уровень window
				scope[name] = value;
			}

			function chekOptions(settings){ //проверка объекта настроек
				return Object.prototype.toString.call(settings) === "[object Object]" || "[object String]";
			}

			function processingOptions(settings, wrapper){ //распарсиваем настройки и устанавливаем их для контента и обертки контента
				/*
				this.node.style.maxWidth = settings.maxWidth + "px";
				this.node.style.maxHeight = settings.maxHeight + "px";
				this.node.style.minWidth = settings.minWidth + "px";
				this.node.style.minHeight = settings.minHeight + "px";
				*/

				if (settings !== "empty"){
					wrapper.style.minWidth = (parseInt(settings.minWidth,10) + 30) + "px";
					wrapper.style.minHeight = (parseInt(settings.minHeight,10) + 30) + "px";
					wrapper.style.maxWidth = (parseInt(settings.maxWidth,10) + 30) + "px";
					wrapper.style.maxHeight = (parseInt(settings.maxHeight,10) + 30) + "px";
				}
			}

			function bind(obj, event_name, handler, el){
				var handlerWrapper = function (event){
					event = event || window.event;
					if (!event.target && event.srcElement){
						event.target = event.srcElement;
					}
					return handler.call(obj, event, el);
				};

				if (obj.addEventListener) {
					obj.addEventListener(event_name, handlerWrapper, false);
				} else if (obj.attachEvent) {
					obj.attachEvent('on' + event_name, handlerWrapper);
				}
				return handlerWrapper;
			}

			function topWalker(node, test_func, last_parent){
				while (node && node !== last_parent){
					if (test_func(node)){
						return node;
					}
					node = node.parentNode;
				}
			}
			
			function hasClass(node, className){// проверка существования соответсвующего класса
				try{
					var getClass = node.getAttribute("class");
					
					if (getClass && getClass.search(className) !== -1){
						return true;
					} else {
						return false;
					}
				} catch (err){
					console.log("Херня, узел надо передавать object HTMLDocument");
					return false;
				}
			}

			function howNodeClick(node){ // Что-то делает, что-то важное... Отлавливаем на каком элементе произошло событие и каким классом обладает этот элемент
				return topWalker(node, function (node){
					if (hasClass(node, "popup_overlay")){
						return true;
					}
					if (hasClass(node, "popup_wrapper")){
						return true;
					}
					if (hasClass(node, "closet_popup")){
						return true;
					}
					return false;
				});
			}

			function init(nodes, settings){ // инициализация попап

				var overlay = document.createElement("div"); // создаем слой затемнения
					overlay.setAttribute("class", "popup_overlay");

				var wrapper = document.createElement("div"); // обертка
					wrapper.setAttribute("class", "popup_wrapper popup_content");
				
				var wrapperOverlay = document.createElement("div");
					wrapperOverlay.setAttribute("class", "mm_wrap_overlay");

				var closet = document.createElement("div"); // кнопка закрытия попапа
					closet.setAttribute("class", "closet_popup");

				wrapper.appendChild(closet);

				if (settings){ //проверяем какие настройки зашли
					processingOptions.call(this, settings, wrapper);
				} else {
					processingOptions.call(this, defaultSettings, wrapper);
				}

				nodes.forEach(function (elem){
					wrapper.appendChild(elem);
				});

				overlay.appendChild(wrapper);
				overlay.appendChild(wrapperOverlay);

				this.popup = overlay;

				bind(this.popup, 'click', function (event){
					var node;

					node = howNodeClick(event.target);
					
					if (hasClass(node, "closet_popup") || hasClass(node, "popup_overlay")) {
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

					if (el && keycode === 27){ // проверка на Esc
						el.style.display = "none";
					}
				}, this.popup);

				return  this.popup;// возвращаем весь попап в сборке
			}

			function getNodes(nodes){
				var nodesArr = [];

				nodes.forEach(function(elem){
								nodesArr.push(document.querySelector(elem).cloneNode(true));
							});

				return nodesArr;
			}

			function Popup(elemsClasses, options){ // конструктор
				var nodesArr;
				
				nodesArr = getNodes(elemsClasses);// устанавливаем узелы

				/*if (nodeObj.tagName === "OBJECT"){
					var param = document.createElement("param");
						param.setAttribute("name", "wmode");
						param.setAttribute("value", "opaque");
					nodeObj.insertBefore(param, nodeObj.lastChild);
				}*/

				this.options = options || defaultSettings;

				nodesArr.forEach(function(elem){
								var elemClass;

				 				elemClass = elem.getAttribute("class");//получаем класс узла

								if(elemClass.search(/popup/) !== -1){ //проверяем существование соответствующего класса
									elem.setAttribute("class",  elemClass + " popup_active")
								}
				 			});

				if (chekOptions(this.options)){ // если есть объект настроек
					init.call(this, nodesArr, this.options);	// настраиваем и инициализируем попап
				} else {
					init.call(this, nodesArr);	//вызываем инициализацию с default настройками
				}
			}

			exportModule(window.mmcore, "mm_popup", Popup);

		$(function(){
			$("#product").addClass("mm_popup");

			var pop = new mmcore.mm_popup(["#product"], /*"empty");*/{maxWidth : "900", maxHeight : "500", minWidth : "700", minHeight : "400"});
			
			pop.show();function(){
				$(".popup_active div.carousel_wrap ul").removeAttr("style");
				$(".popup_active div.carousel_wrap").removeAttr("style");
			});
		});
	});
/*------------------------------------------------------------------------*/