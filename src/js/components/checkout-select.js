import TomSelect from 'tom-select';
import { onWindowScroll, exist, tomSelectConfig } from '../utils';

const checkoutSelect = () => {
	const SELECTORS = {
		checkoutSelect: '.js-checkout-select',
		selectCountry: 'billing_country',
		selectState: 'billing_state',
	};

	const $selects = document.querySelectorAll(SELECTORS.checkoutSelect);
	const $country = document.getElementById(SELECTORS.selectCountry);

	let $state = document.getElementById(SELECTORS.selectState);
	if (!exist($selects)) return;

	$selects.forEach((item) => {
		item.classList.remove('form_input__element');
	});

	let countrySelect = new TomSelect($country, tomSelectConfig);
	let stateSelect = new TomSelect($state, tomSelectConfig);

	$country.addEventListener('change', () => {
		stateSelect?.destroy();
		$state = document.getElementById(SELECTORS.selectState);
		// $state?.remove();
		setTimeout(() => {
			$state = document.getElementById(SELECTORS.selectState);
			if (!exist($state)) return;
			$state.classList.remove('form_input__element');
			stateSelect = new TomSelect($state, tomSelectConfig);
		}, 100);
	});
};

export default checkoutSelect;
