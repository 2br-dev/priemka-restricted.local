import Lazy from 'vanilla-lazyload';
import * as M from 'materialize-css';
import Calculator from './lib/calculator';

declare var ymaps:any;
let loaded = 0;

document.addEventListener('DOMContentLoaded', () => {

	history.scrollRestoration = 'manual';
	document.documentElement.scrollTop = 0;

	new Lazy({}, document.querySelectorAll('.lazy'));						// Динамическая загрузка изображений
	new Lazy({
		callback_loaded: hideSplash
	}, document.querySelectorAll('.lazy-video'))
	M.Sidenav.init(document.querySelector('.sidenav'), { edge: 'right' });	// Сайднав (боковая панель навигации)
	$('body').on('click', '.card .footer a', view3DMap);					// Просмотр 3D-карты 
	$('body').on('click', '.faq-header', toggleFAQ);						// Отображение блоков вопрос-ответ
	$('body').on('click', '.scroll-link', scrollTo);						// Прокрутка до заданной секции
	$('body').on('click', '.banner-section', openBannerLink);				// Открытие ссылки в банере
	renderPage();															// Установка header'а
	
	let calculator = new Calculator('#output').init();						// Калькулятор
});

function openBannerLink(e:JQuery.ClickEvent){
	e.preventDefault();
	let el = <HTMLElement>e.currentTarget;
	let linkEl = <HTMLAnchorElement>el.querySelector('a');
	let link = linkEl.href;
	window.open(link, '_blank');
}

function hideSplash(){
	$('.splash').fadeOut(500);
	$('body').removeClass('fixed');
}

function scrollTo(e:JQuery.ClickEvent){
	e.preventDefault();
	let el = <HTMLLinkElement>e.currentTarget;
	let hash = new URL(el.href).hash;
	let top = $(hash).offset()?.top;

	$('html, body').animate({
		scrollTop: top
	}, 600);

	let sidenav = <HTMLElement>document.querySelector('.sidenav');
	let sidenavInstance = M.Sidenav.getInstance(sidenav);
	sidenavInstance.close();

}

/**
 * Обработка объектов при попадании их в область видимости
 * @param {IntersectionObserverEntry[]} entries Пересечения
 * @param {IntersectionObserver} observer Обозреватель
 */
function reactIntersect(entries:IntersectionObserverEntry[], observer:IntersectionObserver){
	entries.forEach((entry:IntersectionObserverEntry) => {
		let el = entry.target;
		if(entry.isIntersecting){
			el.classList.add('visible');
		}else{
			// el.classList.remove('visible');
		}
	})
}

/**
 * Отрисовка динамических элементов
 */
function renderPage(){

	let scrollTop = document.documentElement.scrollTop;
	let headerTop = 74 - scrollTop;
	let percent = Math.round((scrollTop * 74) / 100);
	let header = <HTMLElement>document.querySelector('header');
	header.classList.add('dark');
	$('#logo-text').attr('src', '/lpk-2024-restricted/img/logo_text.svg');
	$('#logo-leaf').attr('src', '/lpk-2024-restricted/img/logo_leaf.svg');
	header.style.backgroundColor = `rgba(255, 255, 255, .7)`;

	requestAnimationFrame(renderPage);
}

/**
 * Добавление «лидирующего» нуля
 * @param {number} n - Число, к которому нужмо применить лидирующий нуль
 * @returns {string} Строка с лидирующим нулем или без него
 */
function addZero(n: number): string {
	return n > 9 ? "" + n : "0" + n;
}

/**
 * Отображение FAQ
 */
function toggleFAQ(e:JQuery.ClickEvent){
	e.preventDefault();
	let _this = <HTMLElement>e.currentTarget;
	let answer = _this.nextElementSibling;
	$(answer).slideToggle('fast');
	$(this).toggleClass('active');
}

/**
 *  Просмотр 3D карты
 */
function view3DMap(e:JQuery.ClickEvent){
	let el = <HTMLElement>e.currentTarget;
	let edge = el.id;
	let map = document.querySelector('#territory img');

	$('.card .footer a').removeClass('active');
	el.classList.add('active');

	map.className = `lazy ${edge}`;
}

/**
 * Подгрузка скрипта
 * @param {string} url Адрес скрипта
 * @param {void} callback Обработчик, запускаемый по окончании загрузки
 */
function loadScript(url:string, callback:()=>any){
	let script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = url;
	script.onload = callback;
	document.body.appendChild(script);

	if((script as any).readyState){ //IE
		(script as any).onreadystatechange = function(){
			if((script as any).readyState === "loaded" || (script as any).readyState === "complete"){
				(script as any).onreadystatechange = null;
				callback();
			}
		}
	}else{
		script.onload = callback;
	}

	script.src = url;
	document.getElementsByTagName("head")[0].appendChild(script);
}

/**
 * Инициализация карты
 */
function initMap(){
	loadScript("https://api-maps.yandex.ru/2.1/?lang=ru_RU", () => {
		ymaps.ready(() => {
			
			let map = new ymaps.Map('map', {
				center: [45.045410, 38.930008],
				zoom: 17
			})

			map.behaviors.disable('scrollZoom');

			// Подпись к маркеру
			let LayoutClass = ymaps.templateLayoutFactory.createClass(
				'<p class="placemark-text">Приёмная комиссия КубГАУ</p>'
			);

			// Маркер института
			let facultyMarker = new ymaps.Placemark([45.046726, 38.928506]);
			facultyMarker.options.set('iconLayout', 'default#imageWithContent');
			facultyMarker.options.set('iconImageHref', '/lpk-2024-restricted/img/faculty_marker.svg')
			facultyMarker.options.set('iconImageSize', [60, 72]);
			facultyMarker.options.set('iconImageOffset', [-30, -72])
			facultyMarker.options.set('iconContentLayout', LayoutClass);

			map.geoObjects.add(facultyMarker);

			let url = "https://yandex.ru/maps/35/krasnodar/?ll=38.933176%2C45.045049&mode=routes&rtext=~45.046639%2C38.928455&rtt=auto&ruri=~&z=16";
			facultyMarker.events.add(['click'], () => {
				window.open(url, "_blank");
			})

			

			// Маркер парковки
			let parkingMarker = new ymaps.Placemark([45.044483, 38.928892]);
			parkingMarker.options.set('iconLayout', 'default#image');
			parkingMarker.options.set('iconImageHref', '/lpk-2024-restricted/img/parking_marker.svg')
			parkingMarker.options.set('iconImageSize', [40, 64]);
			parkingMarker.options.set('iconImageOffset', [-20, -64])
			map.geoObjects.add(parkingMarker);
		})
	})
}