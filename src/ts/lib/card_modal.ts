import { ICardData, IEducationForm } from "./card_interfaces";
import template from "./details_template";
import data_tpl from './data_tpl';

class CardModal{

	cardData:ICardData;
	mustache:any;

	constructor(data:ICardData){

		this.cardData = data;
		this.mustache = require('mustache');
		let DOM = this.mustache.render(template, data);
		$('body').append(DOM);
		$('.modal .segmented-control li:first-of-type [name="modal-form"]').attr('checked', 1);

		$('body').on('click', '#close-modal', this.closeModal);
		$('body').on('change', '[name="modal-form"]', this.switchForm.bind(this));
		document.documentElement.addEventListener('keyup', this.closeCardEsc.bind(this));

		// Выбор формы обучения
		let form = this.cardData.selectedForm?.name;

		$(`[value="${form}"]`).prop('checked', true);

		setTimeout(() => {
			$('.modal-wrapper').addClass('open');
		}, 80);
	}

	closeCardEsc(e:KeyboardEvent){
		if(e.key == "Escape"){
			this.closeModal();
		}
	}

	closeModal(){
		$('.modal-wrapper').removeClass('open');
		setTimeout(() => {
			$('.modal-wrapper').remove();
		}, 600);
	}

	switchForm(e:JQuery.ClickEvent){
		let formName = $(e.target).val();
		let form = this.cardData.selectedLevel?.forms.filter((f:IEducationForm) => {
			return f.name === formName;
		});
		if(form){
			this.cardData.selectedForm = form[0];
			let DOM = this.mustache.render(data_tpl, this.cardData);
			$('#numbers-wrapper').html(DOM);
		}

	}
}

export default CardModal;