class Tooltip{

	elements: Array<HTMLElement>;

	constructor(elements:Array<HTMLElement> | string){
		if (typeof elements === 'string') {
			this.elements = Array.from(document.querySelectorAll(elements));
		}else{
			this.elements = elements;
		}

		this.elements.forEach((el:HTMLElement) => {
			el.addEventListener('mouseenter', this.onMouseEnter.bind(this));
			el.addEventListener('mouseleave', this.onMouseLeave.bind(this));
			el.addEventListener('mousemove', this.onMouseMove.bind(this));
		})
	}

	onMouseEnter(e:MouseEvent){
		const tooltip = document.createElement('div');
		tooltip.classList.add('tooltip');
		tooltip.textContent = (e.target as HTMLElement).dataset['tooltip'];

		tooltip.style.top = `${e.clientY + 20}px`;
		tooltip.style.left = `${e.clientX + 20}px`;


		document.body.appendChild(tooltip);
		setTimeout(() => {
			tooltip.classList.add('open');
		})
	}

	onMouseLeave(e:MouseEvent){
		const tooltip = document.querySelector('.tooltip');
		if (tooltip) {
			document.body.removeChild(tooltip);
			tooltip.classList.remove('open');
			setTimeout(() => {
				tooltip.remove();
			}, 300);
		}
	}

	onMouseMove(e:MouseEvent){
		const tooltip = document.querySelector('.tooltip') as HTMLElement;
		if (tooltip) {

			let winDiff = window.innerWidth - (e.clientX + (e.target as HTMLElement).clientWidth) - 70;
			if(winDiff < 0) console.log(winDiff);

			let left = e.clientX + 20;

			if(winDiff < 0){
				left = e.clientX + winDiff;
			}

			tooltip.style.left = `${left}px`
			tooltip.style.top = `${e.clientY + 20}px`
		}
	}
}

export default Tooltip;