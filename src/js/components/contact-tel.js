import TomSelect from 'tom-select';
import { exist, tomSelectConfig } from '../utils/index';
import { COUNTRIES } from '../utils/constants';

const contactTel = () => {
	const SELECTORS = {
		telWrap: '.js-form-tel-wrap',
		telInput: '.js-form-tel',
		telOutput: '.js-form-tel-output',
		countryInput: '.js-form-country',
		emoji: '.js-form-tel-emoji',
		telCode: '.qq',
	};

	const CLASSES = {
		emojiState: 'form_input__field--emoji_mod',
	};

	const $telWrap = document.querySelector(SELECTORS.telWrap);
	const $tel = document.querySelector(SELECTORS.telInput);
	const $output = document.querySelector(SELECTORS.telOutput);
	const $emoji = document.querySelector(SELECTORS.emoji);
	const $select = document.querySelector(SELECTORS.countryInput);

	let isTelFocused = false;
	let activeCountry;

	if (!$select) return;

	COUNTRIES.forEach((item, index) => {
		let option = document.createElement('option');
		option.value = item.name;
		option.innerHTML = item.name;
		$select.appendChild(option);
	});

	const selectEl = new TomSelect($select, tomSelectConfig);

	const placeholder = document.createElement('option');
	placeholder.value = null;
	placeholder.innerHTML = '';
	placeholder.disabled = true;
	placeholder.selected = true;
	$select.appendChild(placeholder);

	selectEl.settings.placeholder = 'Location';
	selectEl.inputState();
	selectEl.clear();
	selectEl.on('change', () => {
		activeCountry = COUNTRIES.find((el) => el.name === $select.value);

		// eslint-disable-next-line no-restricted-syntax
		for (const item of COUNTRIES) {
			if ($select.value.startsWith(item.name) && !isTelFocused) {
				if ($tel.value.length === 0) {
					$tel.value = item.dial_code;
					$emoji.innerHTML = `${item.emoji}`;
					$telWrap.classList.add(CLASSES.emojiState);
					// $output.innerHTML = item.dial_code;
					$tel.value = item.dial_code;
				}

				break;
			}
		}
	});
	if (!exist($telWrap)) return;

	$tel.addEventListener('focus', () => {
		isTelFocused = true;
	});

	$tel.addEventListener('blur', () => {
		isTelFocused = false;
	});

	$tel.addEventListener('input', (e) => {
		const { value } = $tel;
		let activeFlag = null;

		// eslint-disable-next-line no-restricted-syntax
		for (const item of COUNTRIES) {
			if (value.startsWith(item.dial_code)) {
				if ($select.value.length === 0) {
					selectEl.setValue(item.name);
				}

				if (activeCountry.dial_code !== item.dial_code || !$telWrap.classList.contains(CLASSES.emojiState)) {
					$emoji.innerHTML = `${item.emoji}`;
					$telWrap.classList.add(CLASSES.emojiState);
				}
				activeFlag = true;
				break;
			}
		}

		if (!activeFlag) {
			$emoji.innerHTML = '';
			$telWrap.classList.remove(CLASSES.emojiState);
		}

		// $output.value = value;
	});
};

export default contactTel;
