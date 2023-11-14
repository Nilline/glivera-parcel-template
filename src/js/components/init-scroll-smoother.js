import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import ScrollSmoother from '../vendors/ScrollSmoother';

const initScrollSmoother = () => {
	gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

	window.scrollTo(0, 0);

	window.scrollSmoother = ScrollSmoother.create({
		wrapper: document.querySelector('.js-scroll-wrapper'),
		content: document.querySelector('.js-scroll-inner'),
		smooth: 1, // how long (in seconds) it takes to "catch up" to the native scroll position
		smoothTouch: false, // much shorter smoothing time on touch devices (default is NO smoothing on touch devices)
		normalizeScroll: window.innerWidth < 768,
	});
	// window.scrollSmoother.refresh();
	// setTimeout(() => {
	// ScrollTrigger.refresh();
	// }, 5000);
};

export default initScrollSmoother;
