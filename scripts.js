
let quiz = window.keradan_quiz = window.keradan_quiz ?? {};

quiz.el = document.querySelector('.prices-screen .popup-quiz');

// Initialization of quiz model
quiz.steps_count = 5;
quiz.current_step_id = 1;
quiz.is_show = false;

// Quiz model data initialization with defaults
quiz.data = {
	content_description: '',
	budget_range: '',
	nda_protect: false,
	contacts: {
		name: '',
		email: '',
		phone: '',
	},
	services: {
		software_consultancy: false,
		web_development: false,
		mobile_app_development: false,
		ux_ui_design: false,
		data_science: false,
		quality_assurance: false,
	},
};

quiz.open = function(){
	if (quiz.is_show) return;
	quiz.is_show = true;
	quiz.render();
};

quiz.close = function(){
	if (!quiz.is_show) return;
	quiz.is_show = false;
	quiz.render();
};

quiz.update_data = function(quiz_model_key_text, new_data = null){
	let model = quiz.data;
	quiz_model_key_text.split('.').forEach(function(key, i, all_keys) {
		if (i === all_keys.length - 1) model[key] = new_data;
		else model = model[key];
	});
};

quiz.change_step = function(new_step){
	if (!quiz.is_show) return;
	quiz.current_step_id = new_step;
	quiz.render();
};

quiz.check_input_validation = function(el){
	return !(!el.value || 0 === el.value.length);
}

// Main function for sending data
quiz.attempt_to_send_data = function(){
	let total_validation = true;
	document.querySelectorAll('.prices-screen .quiz-step-block[data-quiz-step-id="4"] .form-inputs input[type="text"]').forEach(function(el){
		let el_validation = quiz.check_input_validation(el);
		el.classList.toggle('validation-failed', !el_validation);

		if(!el_validation) total_validation = false;
	});

	if(total_validation) {
		// Here you can send data wherever you need!
		console.log('Quiz data is ready to send: ', quiz.data);

		quiz.change_step(5);
	}
}

quiz.render = function(){
	// Show or hide quiz
	if (quiz.is_show) {
		quiz.el.classList.toggle('display-on', true);
		setTimeout(() => quiz.el.classList.toggle('show-quiz', true),1);
	} else {
		quiz.el.classList.toggle('show-quiz', false);
		setTimeout(() => quiz.el.classList.toggle('display-on', false),300);
	}

	// Get current and next steps from DOM
	let last_step_el = quiz.el.querySelector(`.quiz-step-block[data-quiz-cur-step]`);
	let last_step_id = parseInt(last_step_el.dataset.quizStepId);

	let new_step_el = quiz.el.querySelector(`.quiz-step-block[data-quiz-step-id="${quiz.current_step_id}"]`);
	let new_step_id = parseInt(new_step_el.dataset.quizStepId);

	// if current step in model had been changed, change current steps in DOM
	if (last_step_id != new_step_id) {
		let anim_dir = (last_step_id < new_step_id) ? 'l' : 'r';
		last_step_el.setAttribute('data-quiz-anim-dir', anim_dir);
		new_step_el.setAttribute('data-quiz-anim-dir', anim_dir);
		quiz.el.querySelectorAll(`.quiz-step-block[data-quiz-next-step]`).forEach((el) => el.removeAttribute('data-quiz-next-step'));
		new_step_el.setAttribute('data-quiz-next-step', '');
		
		setTimeout(function(){
			last_step_el.removeAttribute('data-quiz-cur-step');
			new_step_el.setAttribute('data-quiz-cur-step', '');
		},1);
	}
};


// Event listners here:

// listen for open quiz
document.querySelectorAll('.prices-screen *[data-quiz-trigger-action]').forEach(function(el){
	el.addEventListener(el.dataset.quizTriggerAction, (e) => quiz.open());
});

// listen for close quiz
document.querySelectorAll('.prices-screen *[data-quiz-close]').forEach(function(el){
	el.addEventListener('click', (e) => quiz.close());
});

// listen for change steps
document.querySelectorAll('.prices-screen button[data-quiz-go-to-step]').forEach(function(el){
	el.addEventListener('click', (e) => quiz.change_step(el.dataset.quizGoToStep));
});

// listen for choosing budget on third step
document.querySelectorAll('.prices-screen .quiz-step-block .budget-range span').forEach(function(el){
	el.addEventListener('click', function(e){
		let old_checked = document.querySelector('.prices-screen .quiz-step-block .budget-range span.checked');
		if(old_checked) old_checked.classList.toggle('checked', false);
		el.classList.toggle('checked', true);
	});
});

// listen inputs on form step for validation
document.querySelectorAll('.prices-screen .quiz-step-block[data-quiz-step-id="4"] .form-inputs input[type="text"]').forEach(function(el){
	el.addEventListener('change', function(e){
		let el_validation = quiz.check_input_validation(el);
		el.classList.toggle('validation-failed', !el_validation);
	});
});

