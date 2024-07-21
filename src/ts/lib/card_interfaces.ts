export enum EducationBase{
	FREE = 'free',
	PAID = 'paid'
}

export interface IFilterParams{
	quickSearch:string,
	level:string,
	base: EducationBase
	form: string,
	requirements: string[],
	minScore:number | null
}

export interface IMinScore{
	year: number,
	score: number
}

export interface IEducationFreeBase{
	name: string,
	total: number,
	main?: number,
	target?: number,
	particular?: number,
	special?: number,
	minScore: IMinScore[]
}

export interface IEducationPaidBase{
	name: string,
	total: number,
	main?: number,
	foreign?: number,
	minScore: IMinScore[]
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
	extra?: {
		head: {
			last_name: string,
			first_name: string,
			middle_name: string,
			rank: string,
			regalia: string,
			phone: string
		},
		networks: {
			icon: string,
			link: string
		}
	}
}

export interface IData{
	elements:Array<ICardData>
}

export interface ISection{
	name: string,
	sectionContent: ICardData[];
	count: number
}

export interface IPreparedData{
	sections: ISection[];
}

export interface IURLCardData{
	id:number,
	form:string,
	level:string
}