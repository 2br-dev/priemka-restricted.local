import Calculator from "./lib/calculator";
import { EducationBase, ICardData, IData } from "./lib/card_interfaces";
import * as M from 'materialize-css';
import CardModal from "./lib/card_modal";

let calculator:Calculator;

let rowsVisible:boolean = false;

// Инициализация
$(() => {
	calculator = new Calculator('#output', '/lpk-2024-restricted/data/data.json', () => {
		M.Tooltip.init(document.querySelectorAll('.tooltipped'));
	});

	$('body').on('input', '[name="search"]', quickSearch); 			//Быстрый поиск
	$('body').on('change', '[name="level"]', selectLevel); 			//Уровень образования
	$('body').on('change', '[name="form"]', switchForm);			//Форма образования
	$('body').on('change', '[name="base"]', switchBase);			//Фин. база
	$('body').on('change', '[name="score"]', collectFilters);		//Минимальный балл
	$('body').on('change', '[name="result[]"]', collectFilters);	//Результаты ЕГЭ
	$('body').on('click', '#submit', filter);						//Запуск фильтров
	$('body').on('click', '#reset', reset);							//Сброс фильтров
	$('body').on('click', '.faculty-header', toggleFaculty);		//Отображение содержимого факультета
	$('body').on('click', '[data-remark]', openRemark);				// Открытие пояснения к стоимости
	$('body').on('click', '.remark-close-trigger', closeRemark);	// Закрытие пояснения к стоимости по клику на X
	$('body').on('click', '#toggle-rows', toggleRows);				// Переключение видимости строк

	$('body').on('click', '.spec-card', openModal);

})

// Переключение открытости строк
function toggleRows(e?:JQuery.ClickEvent){
	e?.preventDefault();
	rowsVisible = !rowsVisible;
	let buttonText = rowsVisible ? 'Свернуть все' : 'Развернуть все';
	$('#toggle-rows').text(buttonText);

	$('.faculty-header').each((index:number, el:HTMLElement) => {
		let $el = $(el);
		if(rowsVisible){
			$el.addClass('active');
			$el.next().slideDown();
		}else{
			$el.removeClass('active');
			$el.next().slideUp();
		}
	})
}

// Модальное окно с описанием
function openModal(e:JQuery.ClickEvent){

	let path = e.originalEvent?.composedPath();
	let cardEl = e.currentTarget as HTMLElement;

	let links = path?.filter((e:EventTarget) => {
		return e instanceof HTMLAnchorElement;
	})

	if(!links?.length){

		let calculatorData:IData = calculator?.filteredData;
		let cardId = parseInt(cardEl.dataset['id'] || "");
		cardEl.classList.add('waves-effect');
	
		if(!isNaN(cardId)){
			let cards = calculatorData.elements.filter((c:ICardData) => {
				return c.id === cardId;
			});
	
			if(cards.length){
				let card = cards[0];
				let modal = new CardModal(card);
			}
		}
	}else{
		cardEl.classList.remove('waves-effect');
	}
}

// Закрытие пояснений к цене
function closeRemark(e:JQuery.ClickEvent){
	e.preventDefault();
	let remark  = $(e.currentTarget).parents('.remark-popup');
	remark.removeClass('open');

	setTimeout(() => {
		remark.remove();
	}, 500)
}

// Открытие пояснений к цене
function openRemark(e:JQuery.ClickEvent){

	let remark = e.currentTarget.dataset['remark'];

	// Проверяем наличие уже открытого popup'а
	if($('.remark-popup').length > 0){
		return null;
	}

	if(remark && remark != ""){

		// Формирование DOM
		let remarkPopup = document.createElement('div');
		remarkPopup.className = 'remark-popup';
		let remarkCloseTrigger = document.createElement('a');
		remarkCloseTrigger.className = 'bx bx-x remark-close-trigger';
		remarkCloseTrigger.setAttribute('href', 'javascript:void(0)');
		let remarkContent = document.createElement('div');
		remarkContent.className = 'remark-content';
		remarkContent.innerHTML = remark;
		remarkPopup.append(remarkContent);
		remarkPopup.append(remarkCloseTrigger);
		let parent = e.currentTarget.parentElement;


		// Открытие
		parent.append(remarkPopup);
		setTimeout(() => {
			remarkPopup.classList.add('open');
		})
	}
}

// Переключение отображения факультета
function toggleFaculty(e:JQuery.ClickEvent){
	let fheader = $(e.currentTarget);
	let sectionCards = fheader.next();

	let already = sectionCards.is(':visible');
	let classname = already ? "faculty-header" : "faculty-header active";
	fheader[0].className = classname;

	sectionCards.slideToggle({
		duration: 'fast'
	});

	// Если все строки развёрнуты вручную
	if($('.faculty-header.active').length === $('.faculty-header').length){
		rowsVisible = true;
		$('#toggle-rows').text('Свернуть все');
	}

	// Если все строки свёрнуты вручную
	if($('.faculty-header:not(.active)').length === $('.faculty-header').length){
		rowsVisible = false;
		$('#toggle-rows').text('Развернуть все');
	}
}

// Запуск фильтрации
function filter(){
	if(calculator.filterParams.requirements.length > 0 && calculator.filterParams.requirements.length < 3){
		M.toast({html: "Пожалуйста, выберите не менее трёх предметов!"})
		return null;
	}
	calculator?.render();
	rowsVisible = false;
	toggleRows();

	if(!$('.faculty-header').length){
		$('#toggle-rows').addClass('disabled');
	}else{
		$('#toggle-rows').removeClass('disabled');
	}
}

// Сброс фильтров
function reset(){
	calculator.reset();
	(document.querySelector('#filters') as HTMLFormElement).reset();
	(document.querySelector('#top-form') as HTMLFormElement).reset();
	$('#output').scrollTop(0);
	$('#toggle-rows').text('Развернуть все');
	rowsVisible = false;
	calculator?.render();
}

// Сбор данных фильтров
function collectFilters(){

	if(calculator){

		// Минимальный балл
		calculator.filterParams.minScore = parseInt((document.querySelector('[name="score"]') as HTMLInputElement).value) || null

		// Результаты ЕГЭ
		calculator.filterParams.requirements = [];
		document.querySelectorAll('[name="result[]"]:checked').forEach((el:EventTarget) => {
			calculator.filterParams.requirements.push((el as HTMLInputElement).value);
		})
	}

}

// База образования
function switchBase(){

	let rows:boolean[] = SaveRowsVisibility();
	calculator.filterParams.base = (document.querySelector('[name="base"]:checked') as HTMLInputElement).value === 'free' ? EducationBase.FREE : EducationBase.PAID;
	calculator.render();
	RestoreRowsVisibility(rows)
	toggleRowsButton();

}

// Форма образования
function switchForm(){
	if(calculator){
		let rows = SaveRowsVisibility();
		let form = (document.querySelector('[name="form"]:checked') as HTMLInputElement).value;
		calculator.filterParams.form = form;
		calculator.render();
		RestoreRowsVisibility(rows);
		toggleRowsButton();
	}
}

// Установка доступности кнопки "Развернуть все"
function toggleRowsButton(){
	if(!$('.faculty-header').length){
		$('#toggle-rows').addClass('disabled');
	}else{
		$('#toggle-rows').removeClass('disabled');
	}
}

// Быстрый поиск
function quickSearch(){
	if(calculator){
		calculator.filterParams.quickSearch = (document.querySelector('[name="search"]') as HTMLInputElement).value;
		calculator.render();
	}
}

// Уровень образования
function selectLevel(){
	if(calculator){
		let level = (document.querySelector('[name="level"]:checked') as HTMLInputElement).value;
		
		(document.querySelector('#filters') as HTMLFormElement).reset();
		calculator.reset();

		calculator.filterParams.level = level;

		if(level !== "Бакалавриат/специалитет"){
			$('[name="result[]"]').prop('checked', false);
			$('.tag, .input-field').addClass('disabled');
			$('[name="score"]').val('');

		}else{
			$('.tag, .input-field').removeClass('disabled');
		}

		calculator.container.setAttribute('data-level', level);
		calculator.render();
		toggleRowsButton();
	}
}

// Сохранение видимости строк
function SaveRowsVisibility():boolean[]{
	let rows:Array<boolean> = []
	document.querySelectorAll('.faculty-header').forEach((el) => {
		rows.push(el.classList.contains('active') ? true : false);
	})
	return rows;
}

// Восстановление видимости сток
function RestoreRowsVisibility(rows:boolean[]){
	rows.forEach((visible:boolean, index:number) => {
		if(visible){
			let el = $('.faculty-header')[index];
			$(el).addClass('active').next().show()			
		}
	})
}