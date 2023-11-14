import { exist } from '../utils/index';
import selectInit from './select-init';
import contactTel from './contact-tel';

// import 'ScssComponents/form.scss';

const contactForm = () => {
	selectInit();
	contactTel();

	// const SELECTORS = {
	// 	submit: '.js-form-submit',
	// 	popup: '.js-form-success',
	// };
	//
	// const CLASSES = {
	// 	popupActive: 'contact_form__success--acitve_state',
	// 	bodyPopupOpen: 'body--popup_active_mod',
	// };
	//
	// const $popup = document.querySelector(SELECTORS.popup);
	// const $submit = document.querySelector(SELECTORS.submit);
	//
	// if (!exist($popup)) return;

	// $submit.addEventListener('click', (e) => {
	// 	e.preventDefault();
	// 	console.log('c');
	// 	$popup.classList.add(CLASSES.popupActive);
	// 	document.body.classList.add(CLASSES.bodyPopupOpen);
	//
	// 	setTimeout(() => {
	// 		$popup.classList.remove(CLASSES.popupActive);
	// 		document.body.classList.remove(CLASSES.bodyPopupOpen);
	// 	}, 4000);
	// });
};

export default contactForm;
