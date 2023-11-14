import Swiper from 'swiper';
import { Autoplay, Navigation, Scrollbar } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import { buildSwiper } from './buildSwiper';

import tabs from './tabs';

// import 'ScssComponents/dream-home.scss';
// import 'ScssComponents/home.scss';
// import 'ScssComponents/building.scss';
// import 'ScssComponents/slider-controls.scss';

const dreamHome = () => {
	const SELECTORS = {
		tabsTrigger: '.js-building-tab-trigger',
		tabsContent: '.js-building-tab-content',
		slider: '.js-building-slider',
		wrapper: '.js-building-wrapper',
		arrowNext: '.js-building-next',
		arrowPrev: '.js-building-prev',
		scrollbar: '.js-building-scrollbar',
	};

	const classNames = {
		tabTriggerClass: 'building__tabs_head_button',
		tabContentClass: 'building__tabs_item',
	};

	// tabs

	tabs({
		trigger: SELECTORS.tabsTrigger,
		content: SELECTORS.tabsContent,
		triggerClass: classNames.tabTriggerClass,
		contentClass: classNames.tabContentClass,
	});

	// slider

	const $sliderWrappers = document.querySelectorAll(SELECTORS.wrapper);

	if (!$sliderWrappers.length) return;

	$sliderWrappers.forEach(($wrapper) => {
		const $slider = $wrapper.querySelector(SELECTORS.slider);
		if (!$slider) return;

		const $prevArrow = $wrapper.querySelector(SELECTORS.arrowPrev);
		const $nextArrow = $wrapper.querySelector(SELECTORS.arrowNext);
		const $pagination = $wrapper.querySelector(SELECTORS.pagination);

		buildSwiper($slider);

		const sliderInstance = new Swiper($slider, {
			modules: [Navigation, Scrollbar],
			observer: true,
			observeParents: true,
			speed: 800,
			// loop: true,
			spaceBetween: 0,
			navigation: {
				prevEl: $prevArrow,
				nextEl: $nextArrow,
			},
			scrollbar: {
				el: $wrapper.querySelector(SELECTORS.scrollbar),
				draggable: true,
			},
			breakpoints: {
				320: {
					slidesPerView: 'auto',
				},
				1023: {
					slidesPerView: 3,
				},
			},
		});
	});
};

export default dreamHome;
