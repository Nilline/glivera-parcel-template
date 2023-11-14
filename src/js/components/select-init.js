import TomSelect from 'tom-select';
import { exist, onWindowResize, getWindowSize, tomSelectConfig } from '../utils/index';

import 'tom-select/dist/css/tom-select.css';

const selectInit = () => {
	const SELECTORS = {
		select: '.js-select',
	};

	const CLASSNAMES = {
		multiple: 'form_select__element--multiple_mod',
	};

	const $select = document.querySelectorAll(SELECTORS.select);

	if (!exist($select)) return;

	const filtersArray = [];
	// let fieldHeight = 0;

	$select.forEach(($item) => {
		const isMultiple = $item.classList.contains(CLASSNAMES.multiple);
		const count = isMultiple ? 10 : 1;
		const multiplePlugin = isMultiple ? { plugins: ['remove_button'] } : {};
		let instance = new TomSelect($item, {
			...multiplePlugin,
			...tomSelectConfig,
			controlInput: null,
			maxItems: count,
			// onDropdownOpen: function addClass() {
			// 	onWindowResize(() => {
			// 		if (getWindowSize().windowWidth < 1024) {
			// 			const $dropDownBody = this.wrapper.querySelector(SELECTORS.dropDownBody);
			// 			fieldHeight = this.wrapper.clientHeight;
			// 			// eslint-disable-next-line
			// 			this.wrapper.parentNode.style.height = fieldHeight + $dropDownBody.clientHeight + 'px';
			// 		} else {
			// 			this.wrapper.parentNode.style.height = 'auto';
			// 		}
			// 	});
			// },
			// onDropdownClose: function removeClass() {
			// 	this.wrapper.parentNode.style.height = 'auto';
			// },
			// plugins: {
			// 	remove_button: {
			// 		title: 'Remove this item',
			// 	},
			// },
		});

		filtersArray.push(instance);
	});
};

export default selectInit;
