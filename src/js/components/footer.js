import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';
import { exist } from '../utils';

const footer = () => {
	gsap.registerPlugin(ScrollToPlugin);

	const SELECTORS = {
		anchor: '.js-anchor',
	};

	const anchor = document.querySelector(SELECTORS.anchor);

	if (!exist(anchor)) return;

	anchor.addEventListener('click', () => {
		gsap.to(window, {
			duration: 1,
			ease: 'Sine.easeInOut',
			scrollTo: {
				y: 0,
			},
		});
	});
};

export default footer;
