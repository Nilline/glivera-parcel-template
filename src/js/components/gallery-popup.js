import Swiper from 'swiper';
import { Autoplay, Navigation, Scrollbar } from 'swiper/modules';

import { exist } from '../utils';
// import 'ScssComponents/gallery-popup.scss';
// import 'ScssComponents/slider-controls.scss';
import 'swiper/swiper-bundle.css';

const galleryPopup = (index) => {
	const SELECTORS = {
		wrapper: '.js-gallery-popup-section-wrapper',
		slider: '.js-gallery-popup-section-slider',
		arrowNext: '.js-gallery_popup-next',
		arrowPrev: '.js-gallery_popup-prev',
		trigger: '.js-popup-gallery',
	};

	const CLASSNAMES = {
		bodyPopupOpenState: 'body--popup_active_mod',
		popupActiveState: 'gallery_popup--active_state_mod',
	};

	const $body = document.body;
	const $triggers = document.querySelectorAll(SELECTORS.trigger);
	const $sliderWrapper = document.querySelector(SELECTORS.wrapper);
	let isInit = false;
	let removeSlider;
	let slider;

	if (!exist($triggers) || !exist($sliderWrapper)) return;

	const $slider = $sliderWrapper.querySelector(SELECTORS.slider);

	if (!exist($slider)) return;

	const closePopup = () => {
		$body.classList.remove(CLASSNAMES.bodyPopupOpenState);

		if (window.scrollSmoother) {
			window.scrollSmoother.paused(false);
		}

		if ($sliderWrapper.classList.contains(CLASSNAMES.popupActiveState)) {
			$sliderWrapper.classList.remove(CLASSNAMES.popupActiveState);
		}
		removeSlider();
	};

	$sliderWrapper.addEventListener('click', ({ target }) => {
		if (!target.classList.contains('slider_controls__btn')) {
			closePopup();
		}
	});

	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') {
			closePopup();
		}
	});

	const initSlider = (slide) => {
		$body.classList.add(CLASSNAMES.bodyPopupOpenState);
		$sliderWrapper.classList.add(CLASSNAMES.popupActiveState);

		// if (!isInit) {
		const $prevArrow = $sliderWrapper.querySelector(SELECTORS.arrowPrev);
		const $nextArrow = $sliderWrapper.querySelector(SELECTORS.arrowNext);

		slider = new Swiper($slider, {
			modules: [Navigation],
			initialSlide: slide,
			slidesPerView: 'auto',
			speed: 800,
			centeredSlides: true,
			navigation: {
				prevEl: $prevArrow,
				nextEl: $nextArrow,
			},
		});

		removeSlider = () => slider.destroy(true, true);
		// }

		// isInit = true;
	};

	const initHandlerSlider = () => {
		$triggers.forEach(($item) => {
			$item.addEventListener('click', () => {
				if (window.scrollSmoother) {
					window.scrollSmoother.paused(true);
				}

				initSlider($item.dataset.sliderIndex);
				// console.log($item);

				// if (isInit) slider.slideTo($item.dataset.sliderIndex);
			});
		});
	};

	initHandlerSlider();
};

export default galleryPopup;
