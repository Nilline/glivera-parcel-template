import Swiper from 'swiper';
import { Autoplay, Navigation, Scrollbar } from 'swiper/modules';

import { buildSwiper } from './buildSwiper';
import { exist } from '../utils';
// import 'ScssComponents/partners-section.scss';
import 'swiper/swiper-bundle.css';

const partnersSection = () => {
	const SELECTORS = {
		wrapper: '.js-partners-section-wrapper',
		slider: '.js-partners-section-slider',
	};

	const $sliderWrappers = document.querySelectorAll(SELECTORS.wrapper);

	if (!exist($sliderWrappers)) return;

	$sliderWrappers.forEach(($wrapper) => {
		const $slider = $wrapper.querySelector(SELECTORS.slider);

		if (!exist($slider)) return;

		buildSwiper($slider);

		const slider = new Swiper($slider, {
			modules: [Autoplay],
			autoplay: {
				delay: 0,
				disableOnInteraction: false,
			},
			watchOverflow: true,
			slidesPerView: 'auto',
			speed: 5000,
			loop: true,
			centeredSlides: true,

			breakpoints: {
				320: {
					spaceBetween: 34,
				},
				768: {
					spaceBetween: 70,
				},
				1024: {
					spaceBetween: 101,
				},
			},
		});
	});
};

export default partnersSection;
