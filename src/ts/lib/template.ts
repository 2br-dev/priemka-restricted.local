let template = `
{{#sections}}
<div class="faculty-header" data-faculty="{{name}}">
	<div class="folder-arrow"></div>
	<h2 class="no-margin">{{name}} <span class="indicator {{indicator}}"><span class="available hide">{{count.available}} / </span>{{count.total}}</span></h2>
</div>
<div class="section-wrapper">
	<div class="section-content">
	{{#sectionContent}}
	<div class="spec-card-wrapper">
		<div class="spec-card waves-effect hoverable z-depth-1" data-id="{{id}}" data-faculty="{{faculty.name}}" >
			<div class="card-header">
				<div class="speciality">
					<h3 class="tooltipped" data-tooltip="{{speciality}}" data-position="top">{{speciality}}</h3>
					<p>{{selectedLevel.code}} {{profile}}</p>
				</div>
				{{#selectedBase.minScore.0.score}}
				<div class="min-score">
					<i>Мин. балл '23</i>
					<span>{{selectedBase.minScore.0.score}}</span>
				</div>
				{{/selectedBase.minScore.0.score}}
				{{^selectedBase.minScore.0.score}}
				<div class="min-score">
					<i>Мин. балл '23</i>
					<span class="tooltipped" data-tooltip="Нет данных" data-position="top">Н/Д</span>
				</div>
				{{/selectedBase.minScore.0.score}}
			</div>
			<div class="selected-data">{{selectedForm.name}} форма // {{selectedBase.name}}</div>
			<div class="details">
				<div class="numbers">
					<div class="number-block">
						<div class="title">Форма обучения</div>
						<div class="number">
							{{selectedForm.name}}
						</div>
					</div>
					<div class="number-block">
						<div class="title">Бюджетные места</div>
						<div class="number">
							{{selectedForm.vacations.free.total}}
						</div>
					</div>
					<div class="number-block">
						<div class="title">Места по договору</div>
						<div class="number">
							{{selectedForm.vacations.paid.total}}
						</div>
					</div>
					<div class="number-block">
						<div class="title">Продолжительность</div>
						<div class="number">
							{{selectedForm.duration}}
						</div>
					</div>
					<div class="number-block">
						<div class="title">Стоимость обучения</div>
						<div class="number">
							{{#selectedForm.remark}}
							<a href="javascript:void(0)" data-remark="{{selectedForm.remark}}">
								{{selectedForm.price}} ₽/год
								<i class="bx bxs-info-circle"></i>
							</a>
							{{/selectedForm.remark}}
							{{^selectedForm.remark}}
							{{selectedForm.price}} ₽/год
							{{/selectedForm.remark}}
						</div>
					</div>
				</div>
				<div class="requirements">
					<div class="requirement-header">Обязательные предметы</div>
					{{#necessary}}
					<div class="requirement {{classname}}">{{name}} <span class="min"> {{min}}</span></div>
					{{/necessary}}
					<div class="requirement-header">Дополнительные предметы</div>
					{{#optional}}
					<div class="requirement {{classname}}">{{name}} <span class="min"> {{min}}</span></div>
					{{/optional}}
				</div>
			</div>
			{{#note}}
				<div class="note">
				{{.}}
				</div>
			{{/note}}
			<div class="graph-wrapper" data-years="{{#selectedBase.minScore}}{{year}},{{/selectedBase.minScore}}" data-scores="{{#selectedBase.minScore}}{{score}},{{/selectedBase.minScore}}">

			</div>
		</div>
	</div>
	{{/sectionContent}}
	</div>
</div>
{{/sections}}
{{^sections}}
<div class="nulltext">
	<img src="/lpk-2024-restricted/img/no-result.png" />
</div>
{{/sections}}
`

export default template;