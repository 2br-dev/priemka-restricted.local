let dataTpl = `
<div class="numbers" id="free">
	<h4 class="numbers-header">Бюджетные места</h4>
	<table>
		<tbody>
			{{#selectedForm.vacations.free.total}}
			<tr><td class="key">Всего мест</td><td class="value">
				{{selectedForm.vacations.free.total}}
			</td></tr>
			{{/selectedForm.vacations.free.total}}
			{{^selectedForm.vacations.free.total}}
			<tr><td class="key">Всего мест</td><td class="value">
				Мест нет
			</td></tr>
			{{/selectedForm.vacations.free.total}}
			{{#selectedForm.vacations.free.main}}
			<tr><td class="key">Основные места</td><td class="value">
				{{selectedForm.vacations.free.main}}
			</td></tr>
			{{/selectedForm.vacations.free.main}}
			{{#selectedForm.vacations.free.target}}
			<tr><td class="key">Целевая квота</td><td class="value">
				{{selectedForm.vacations.free.target}}
			</td></tr>
			{{/selectedForm.vacations.free.target}}
			{{#selectedForm.vacations.free.particular}}
			<tr><td class="key">Отдельная квота</td><td class="value">
				{{selectedForm.vacations.free.particular}}
			</td></tr>
			{{/selectedForm.vacations.free.particular}}
			{{#selectedForm.vacations.free.special}}
			<tr><td class="key">Специальная квота</td><td class="value">
				{{selectedForm.vacations.free.special}}
			</td></tr>
			{{/selectedForm.vacations.free.special}}
		</tbody>
	</table>
</div>
<div class="numbers" id="paid">
	<h4 class="numbers-header">Обучение по договору</h4>
	<table>
		<tbody>
			{{#selectedForm.vacations.paid.total}}
			<tr><td class="key">Всего мест</td><td class="value">
				{{selectedForm.vacations.paid.total}}
			</td></tr>
			{{/selectedForm.vacations.paid.total}}
			{{^selectedForm.vacations.paid.total}}
			<tr><td class="key">Всего мест</td><td class="value">
				Мест нет
			</td></tr>
			{{/selectedForm.vacations.paid.total}}
			{{#selectedForm.vacations.paid.main}}
			<tr><td class="key">Основные</td><td class="value">
				{{selectedForm.vacations.paid.main}}
			</td></tr>
			{{/selectedForm.vacations.paid.main}}
			{{#selectedForm.vacations.paid.foreign}}
			<tr><td class="key">Иностранные</td><td class="value">
				{{selectedForm.vacations.paid.foreign}}
			</td></tr>
			{{/selectedForm.vacations.paid.foreign}}
			{{#selectedForm.price}}
			<tr><td class="key">Стоимость</td><td class="value">
				{{selectedForm.price}} ₽/год
			</td></tr>
			{{/selectedForm.price}}
		</tbody>
	</table>
</div>
<div class="numbers" id="contacts">
	<h4 class="numbers-header">Дополнительно</h4>
	<table>
		<tbody>
			<tr><td class="key">Факультет</td><td class="value">{{faculty.name}}</td></tr>
			<tr><td class="key">Декан</td><td class="value">{{extra.head.last_name}} {{extra.head.first_name}} {{extra.head.middle_name}}</td></tr>
			<tr><td class="key">Телефон</td><td class="value">{{extra.head.phone}}</td></tr>
		</tbody>
	</table>
</div>
<div class="numbers" id="results">
	<h4 class="numbers-header">ЕГЭ</h4>
	<table>
		<thead>
			<th colspan="2" class="subheader">Обязательные предметы</th>
		</thead>
		<tbody>
			{{#necessary}}
			<tr><td class="key">{{name}}</td><td class="value {{classname}}">{{min}}</td></tr>
			{{/necessary}}
		</tbody>
	</table>
	<table>
		<thead>
			<th colspan="2" class="subheader">Дополнительные предметы</th>
		</thead>
		<tbody>
			{{#optional}}
			<tr><td class="key">{{name}}</td><td class="value {{classname}}">{{min}}</td></tr>
			{{/optional}}
		</tbody>
	</table>
</div>
`

export default dataTpl;