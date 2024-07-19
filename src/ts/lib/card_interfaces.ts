export interface IEducationFreeBase{
	name: string,
	total: number,
	main?: number,
	target?: number,
	particular?: number,
	special?: number
}

export interface IEducationPaidBase{
	name: string,
	total: number,
	main?: number,
	foreign?: number
}

export interface IEducationForm{
	name: string,
	duration: number,
	price: number,
	remark:string,
	vacations: {
		free: IEducationFreeBase,
		paid: IEducationPaidBase
	}
}

export interface IRequirement{
	name:string,
	min: number,
	classname: string
}

export interface IEducationLevel{
	name: string,
	code: string,
	details?: {
		image?: string,
		about?: string
	},
	forms: Array<IEducationForm>
}

export interface IFormSwitcher{
	name: string,
	classname: string
}

export interface ICardData{
	id?: number,
	faculty: {
		name: string,
		about: string
	}
	profile?: string,
	speciality?: string,
	education_levels?: Array<IEducationLevel>,
	requirements?: Array<IRequirement>,
	necessary?:Array<IRequirement>,
	optional?:Array<IRequirement>,
	price?: number,
	selectedLevel?:IEducationLevel,
	selectedForm?:IEducationForm,
	selectedBase?:IEducationFreeBase | IEducationPaidBase,
	switcher?: IFormSwitcher[],
	externalLink?: string,
	minScore?: number
}

export interface IData{
	elements:Array<ICardData>
}

export interface ISection{
	name: string,
	sectionContent: ICardData[];
}

export interface IPreparedData{
	sections: ISection[];
}

export interface IURLCardData{
	id:number,
	form:string,
	level:string
}