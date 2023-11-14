import TomSelect from 'tom-select';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';
import { exist, onWindowResize, getWindowSize, tomSelectConfig } from '../utils';
import { BREAKPOINTS } from '../utils/constants';
import 'tom-select/dist/css/tom-select.css';
// import 'ScssComponents/shop-plans.scss';
// import 'ScssComponents/home.scss';
// import 'ScssComponents/building.scss';

const shopPlans = () => {
	gsap.registerPlugin(ScrollToPlugin);

	const SELECTORS = {
		select: '.js-tom-select',
		wrapper: '.js-filter-wrapper',
		resetBtn: '.js-filter-reset-btn',
		mobileOpenBtn: '.js-filter-open-btn',
		selectColumn: '.js-filter-select-col',
		customizable: '.js-customizable',
		dropDownBody: '.ts-dropdown',
		option: '.item',
		header: '.header',
		scroller: '.js-scroll-inner',
	};
	const CLASSNAMES = {
		activeColumnState: 'shop_plans__column_form--active_state',
		activeFormState: 'shop_plans__form--active_state',
		openFormState: 'shop_plans__form--open_state',
		delButton: 'shop_plans__clear_btn',
		touch: 'touch_device_state',
	};

	const $wrapper = document.querySelector(SELECTORS.wrapper);

	if (!exist($wrapper)) return;

	const $selects = $wrapper.querySelectorAll(SELECTORS.select);
	const $resetBtn = $wrapper.querySelector(SELECTORS.resetBtn);
	const $openFilterBtn = $wrapper.querySelector(SELECTORS.mobileOpenBtn);
	const $customizableBtn = $wrapper.querySelector(SELECTORS.customizable);
	const arraySelects = [];
	const html = document.documentElement;
	const isTouch = html.classList.contains(CLASSNAMES.touch);
	const $scroller = isTouch ? document.querySelector(SELECTORS.scroller) : window;
	let fieldHeight = 0;
	let inOpenMobileFilter = false;
	let { windowWidth } = getWindowSize();
	let isMobile = false;
	let oldScroll = 0;

	const addActiveClasses = () => {
		$wrapper.classList.add(CLASSNAMES.activeFormState);
		inOpenMobileFilter = true;
	};

	const removeActiveClasses = () => {
		$wrapper.classList.remove(CLASSNAMES.activeFormState);
		inOpenMobileFilter = false;
	};

	const selectedItem = (value, $item) => {
		const $parent = $item.closest(SELECTORS.selectColumn);
		const $wrapper = $item.closest(SELECTORS.wrapper);

		if ($parent) $parent.classList.add(CLASSNAMES.activeColumnState);
		else $item.parentElement.classList.add(CLASSNAMES.activeColumnState);

		$wrapper.classList.add(CLASSNAMES.activeFormState);
	};

	const closeFilter = (sel, resize) => {
		if (windowWidth < BREAKPOINTS.mediaPoint1 && !resize) return;

		const $parent = sel.wrapper.closest(SELECTORS.selectColumn);
		const $wrapper = sel.wrapper.closest(SELECTORS.wrapper);

		$wrapper.classList.remove(CLASSNAMES.activeFormState);
		if (!resize) $parent.classList.remove(CLASSNAMES.activeColumnState);
	};

	const closeDropduwn = () => {
		let counterEmptyFields = 0;

		arraySelects.forEach((sel) => {
			if (!exist(sel.items)) {
				const $parent = sel.wrapper.closest(SELECTORS.selectColumn);

				$parent.classList.remove(CLASSNAMES.activeColumnState);
				counterEmptyFields += 1;
			}
		});

		if (counterEmptyFields === arraySelects.length) {
			$wrapper.classList.remove(CLASSNAMES.openFormState);

			if (windowWidth >= BREAKPOINTS.mediaPoint1) {
				$wrapper.classList.remove(CLASSNAMES.activeFormState);
			}
		}

		if (windowWidth < BREAKPOINTS.mediaPoint1) {
			arraySelects.forEach(($sel) => {
				const $item = $sel;
				$item.wrapper.parentNode.style.height = 'auto';
			});
			$wrapper.classList.remove(CLASSNAMES.openFormState);
		}
	};

	const openDropduwn = () => {
		if (windowWidth < BREAKPOINTS.mediaPoint1) {
			arraySelects.forEach(($sel) => {
				const $item = $sel;

				const $dropDownBody = $item.wrapper.querySelector(SELECTORS.dropDownBody);

				$wrapper.classList.add(CLASSNAMES.openFormState);
				fieldHeight = $item.wrapper.clientHeight;

				$item.wrapper.parentNode.style.height = `${fieldHeight + $dropDownBody.clientHeight}px`;
			});
		}
	};

	const addClearButtonToSelect = (sel) => {
		const $wrapper = sel.wrapper;
		const $selectedItems = $wrapper.querySelectorAll(SELECTORS.option);
		const $btnExists = $wrapper.querySelector(`.${CLASSNAMES.delButton}`);

		if (!exist($selectedItems) || exist($btnExists)) return;

		const $clearButton = document.createElement('button');
		$clearButton.classList.add(CLASSNAMES.delButton);
		$clearButton.setAttribute('type', 'button');
		$clearButton.setAttribute('aria-label', 'clear filter');

		$wrapper.insertAdjacentElement('beforeend', $clearButton);

		$clearButton.addEventListener('click', () => {
			const $parent = sel.wrapper.closest(SELECTORS.selectColumn);

			$parent.classList.remove(CLASSNAMES.activeColumnState);
			sel.clear();
			sel.close();
		});
	};

	const resetSelects = () => {
		$resetBtn.addEventListener('click', () => {
			arraySelects.forEach((sel) => {
				sel.clear();
				closeFilter(sel);
			});
			if ($customizableBtn) {
				$customizableBtn.parentElement.classList.remove(CLASSNAMES.activeColumnState);
			}
		});
	};

	const initScroll = ($wrapper, isTouch) => {
		const $header = document.querySelector(SELECTORS.header);
		const headerHeight = $header.clientHeight;
		const scrollY = isTouch ? $scroller.scrollTop : $scroller.scrollY;
		const posFilter = $wrapper.getBoundingClientRect().top;
		const scrollValue = Math.floor(scrollY - headerHeight + posFilter);

		if (scrollValue !== scrollY) {
			gsap.to($scroller, {
				duration: 1,
				ease: 'Sine.easeInOut',
				scrollTo: {
					y: scrollValue,
				},
				onComplete: () => {
					// Delay is needed to ensure that the class is correctly added at the end of the animation; without it, it would be removed intermittently.
					setTimeout(() => {
						addActiveClasses();
						oldScroll = isTouch ? $scroller.scrollTop : $scroller.scrollY;
					}, 50);
				},
			});
		} else {
			addActiveClasses();
		}
	};

	const setOptionSeparator = (sel) => {
		const $selectedItems = sel.wrapper.querySelectorAll(SELECTORS.option);

		if (!exist($selectedItems)) return;

		const currentItemsLength = $selectedItems.length > 1 ? $selectedItems.length - 1 : $selectedItems.length;
		const separator = $selectedItems.length > 1 ? ',' : '';

		for (let i = 0; i < currentItemsLength; i += 1) {
			const $item = $selectedItems[i];

			$item.textContent = `${$item.dataset.value}${separator}`;
		}
	};

	const toggleFilter = () => {
		$openFilterBtn.addEventListener('click', () => {
			if (inOpenMobileFilter) {
				removeActiveClasses();
			} else {
				initScroll($wrapper, isTouch);
			}
		});

		$scroller.addEventListener('scroll', () => {
			if (inOpenMobileFilter) {
				const scrollY = isTouch ? $scroller.scrollTop : $scroller.scrollY;
				const differenceScrollValue = scrollY - oldScroll;

				if (Math.abs(differenceScrollValue) > 5) removeActiveClasses();
			}
		});
	};

	const toggleScroll = (bool) => {
		if (window.scrollSmoother) window.scrollSmoother.paused(bool);
	};

	const init = () => {
		resetSelects();
		toggleFilter();

		onWindowResize(() => {
			windowWidth = getWindowSize().windowWidth;

			if (windowWidth < BREAKPOINTS.mediaPoint1) {
				if (!isMobile) {
					arraySelects.forEach(($sel) => closeFilter($sel, 'resize'));
					isMobile = true;
				}
			} else {
				if (isMobile) {
					arraySelects.forEach(($sel) => {
						const $item = $sel;

						$item.wrapper.parentNode.style.height = 'auto';

						if (exist($item.items)) {
							selectedItem('', $item.wrapper);
							$item.close();
						}
					});
					isMobile = false;
				}
			}
		});
	};

	$selects.forEach((item) => {
		const sel = new TomSelect(item, {
			...tomSelectConfig,
			hidePlaceholder: true,
			hideSelected: false,
		});
		const $dropdownBody = sel.wrapper.querySelector(SELECTORS.dropDownBody);

		sel.control_input.setAttribute('maxlength', 0);

		sel.on('item_add', selectedItem);
		sel.on('dropdown_close', closeDropduwn);
		sel.on('dropdown_open', openDropduwn);
		sel.on('clear', () => closeFilter(sel));
		sel.on('change', () => {
			setOptionSeparator(sel);
			addClearButtonToSelect(sel);
		});

		arraySelects.push(sel);

		if ($dropdownBody) {
			$dropdownBody.addEventListener('mouseenter', () => toggleScroll(true));
			$dropdownBody.addEventListener('mouseleave', () => toggleScroll(false));
		}
	});

	if ($customizableBtn) {
		$customizableBtn.addEventListener('click', (e) => {
			selectedItem('', $customizableBtn);
		});
	}

	init();
};

export default shopPlans;
