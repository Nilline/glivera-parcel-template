import Swiper from 'swiper';
import { Autoplay, Navigation, Scrollbar } from 'swiper/modules';
import { buildSwiper } from './buildSwiper';
import { exist } from '../utils';
import galleryPopup from './gallery-popup';

import 'swiper/swiper-bundle.css';

const gallery = () => {
	const SELECTORS = {
		wrapper: '.js-gallery-section-wrapper',
		slider: '.js-gallery-section-slider',
		arrowNext: '.js-gallery-next',
		arrowPrev: '.js-gallery-prev',
		scrollbar: '.js-gallery-scrollbar',
	};

	const $sliderWrappers = document.querySelectorAll(SELECTORS.wrapper);

	if (!exist($sliderWrappers)) return;

	$sliderWrappers.forEach(($wrapper) => {
		const $slider = $wrapper.querySelector(SELECTORS.slider);

		const $prevArrow = $wrapper.querySelector(SELECTORS.arrowPrev);
		const $nextArrow = $wrapper.querySelector(SELECTORS.arrowNext);
		const $scrollbar = $wrapper.querySelector(SELECTORS.scrollbar);

		if (!exist($slider)) return;

		buildSwiper($slider);

		const slider = new Swiper($slider, {
			modules: [Autoplay, Navigation, Scrollbar],
			autoplay: {
				delay: 3000,
			},
			watchOverflow: true,
			speed: 1000,
			spaceBetween: 10,
			// loop: true,
			navigation: {
				prevEl: $prevArrow,
				nextEl: $nextArrow,
			},
			scrollbar: {
				el: $scrollbar,
				draggable: true,
			},
			breakpoints: {
				390: {
					slidesPerView: 1,
				},
				1024: {
					slidesPerView: 2,
				},
			},
		});
	});
	galleryPopup();
};

export default gallery;
