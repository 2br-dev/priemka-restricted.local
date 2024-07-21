import { EducationBase, ICardData, IData, IEducationForm, IEducationFreeBase, IEducationLevel, IEducationPaidBase, IFilterParams, IPreparedData, IRequirement, ISection } from './card_interfaces';
import template from './template';

class Calculator{

	data:IData;
	container:HTMLElement;
	filterParams:IFilterParams;
	selectedCard:ICardData;
	filteredData:IData;
	renderComplete?:()=>void

	constructor(container:HTMLElement | string, dataURL:string, renderComplete = () => {}){

		this.renderComplete = renderComplete;

		this.filterParams = {
			quickSearch: "",
			level: "Бакалавриат/специалитет",
			base: EducationBase.FREE,
			form: "Очная",
			minScore: null,
			requirements: []
		}

		if(typeof(container) === "string"){
			this.container = <HTMLElement>document.querySelector(container);
		}else{
			this.container = container;
		}

		fetch(dataURL)
			.then(response => response.json())
			.then(data => {
				this.data = data;
				this.render()
			})
			.catch(err => console.error(err))
	}

	render(){
		this.filter();
		let preparedData = this.prepareData(this.filteredData.elements);
		let mustache = require('mustache');

		let output = mustache.render(template, preparedData);

		this.container.innerHTML = output;
		
		this.renderComplete?.();
	}

	reset(){
		this.filterParams = {
			quickSearch: "",
			level: "Бакалавриат/специалитет",
			base: EducationBase.FREE,
			form: "Очная",
			minScore: null,
			requirements: []
		}
	}

	/**
	 * Фильтрация данных
	 * @returns Данные, попадающие под фильтр IFilterProps
	 */
	filter(){

		let outputArray = this.data.elements;
		
		// Уровень образования
		outputArray = outputArray.filter((el:ICardData) => {
		
			if(el.education_levels){

				let level = el.education_levels.filter((level:IEducationLevel) => {
					if(this.filterParams.level == "Бакалавриат/специалитет"){
						return level.name == "Бакалавриат" || level.name == "Специалитет";
					}else{
						return level.name == this.filterParams.level
					}
				})[0];

				el.selectedLevel = level;

				return level !== undefined;
			}
		})

		// Форма образования
		outputArray = outputArray.filter((card:ICardData) => {
			if(card.selectedLevel){
				let form:IEducationForm = card.selectedLevel.forms.filter((f:IEducationForm) => {
					return f.name === this.filterParams.form
				})[0]

				card.selectedForm = form;

				return form !== undefined
			}

		})

		// Минимальный балл
		outputArray = outputArray.filter((card:ICardData) => {
			if(card.selectedForm){
				let base:IEducationFreeBase | IEducationPaidBase = this.filterParams.base === EducationBase.FREE ? card.selectedForm.vacations.free : card.selectedForm.vacations.paid;
				card.selectedBase = base;
				card.selectedBase.name = this.filterParams.base === EducationBase.FREE ? "Бюджет" : "Договор";

				if( this.filterParams.minScore !== null && base.minScore ){
					return base.minScore[0].score < this.filterParams.minScore
				}else{
					return true
				}
			}
		})

		// Быстрый поиск
		outputArray = outputArray.filter((el:ICardData) => {

			let needleS = (el.speciality || "").toLowerCase();
			let needleF = el.faculty.name.toLowerCase();
			let needleP = (el.profile || "").toLowerCase();
			let search = this.filterParams.quickSearch.toLowerCase().trim();

			let retVal = needleS.indexOf(search) >= 0  || needleF.indexOf(search) >= 0 || needleP.indexOf(search) >= 0 ;

			return retVal === true;
		})

		// Требования
		if(this.filterParams.level == "Бакалавриат" || this.filterParams.level == 'Специалитет' || this.filterParams.level=="Бакалавриат/специалитет"){

			if(this.filterParams.requirements.length >= 3){

				// Первый проход (обязательные предметы)
				let necessary = outputArray.filter((el:ICardData) => {
					
					let necArray = el.requirements?.filter((r:IRequirement) => {
						return r.classname === 'required';
					})
		
					let necStrArray = necArray?.map((r:IRequirement) => {
						return r.name
					});
		
					let necIntersect = this.filterParams.requirements.filter(val => necStrArray?.includes(val));
					return necIntersect.length >= 2
		
				});
		
				// Второй проход (необязательные предметы)
				let optional = necessary.filter((el:ICardData) => {
					let optArray = el.requirements?.filter((r:IRequirement) => {
						return r.classname === 'optional';
					});
		
					let optStrArray = optArray?.map((r:IRequirement) => {
						return r.name;
					})
		
					let optIntersect = this.filterParams.requirements.filter(val => optStrArray?.includes(val));
					return optIntersect.length >= 1;
				});
		
				outputArray = optional;
			}

		}

		let output:IData = {
			elements: outputArray
		}

		this.filteredData = output;
	}

	/**
	 * Сортировка секций
	 */
	sortSections(sections: ISection[]):void{
		sections.sort((a, b) => {
			if (a.name < b.name) return -1;
			if (a.name > b.name) return 1;
			return 0;
		})
	}

	/**
	 * Вставка в указанный индекс массива нового элемента
	 * @param {Array<ICardData>} arr Входной массив
	 * @param {number} index Индекс, куда поместить новый элемент
	 * @param {ICardData} newElement Новый элемент
	 * @returns {Array<ICardData>} Массив со вставленным элементом
	 */
	InsertArray(arr:Array<ICardData>, index:number, newElement:ICardData):ICardData[]{
		let newArray =  [
			...arr.slice(0,index),
			newElement,
			...arr.slice(index)
		]
		return newArray;
	}

	/**
	 * Группировка данных перед передачей в шаблонизатор
	 * @returns Сгруппированные данные IPreparedData
	 */
	prepareData(elements:ICardData[]):IPreparedData{

		if(!elements) return { sections: [] }

		let preparedData = { 
			sections:new Array<ISection>()
		};

		elements.forEach((card:ICardData) => {

			card.necessary = card.requirements?.filter((r:IRequirement) => r.classname == 'required');
			card.optional = card.requirements?.filter((r:IRequirement) => r.classname == 'optional');

			let sectionNeedle = preparedData.sections.filter((s:ISection) => {
				return s.name == card.faculty.name;
			})

			let section:ISection;

			if(sectionNeedle.length === 0){
				section = {
					name: card.faculty.name,
					sectionContent: [card],
					count: 1
				}
				preparedData.sections.push(section);
			}else{
				section = sectionNeedle[0];
				section.sectionContent.push(card);
				section.count++;
			}
		})

		this.sortSections(preparedData.sections);

		if(preparedData.sections.length === 1 && preparedData.sections[0].name === "") preparedData = {sections: []};

		return preparedData;
	}
}

export default Calculator;