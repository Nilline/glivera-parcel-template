// ------------------- imports
import gsap from 'gsap';
import { onWindowResize } from 'utils';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
// 2 разных файла подключено в проект
// ------------------- imports###

// ------------------  import components
import { calcViewportHeight } from '../utils';
import { header } from '../components/header';
import footer from '../components/footer';
// ------------------  import components###

const layout = () => {
	let windowWidth = window.innerWidth;
	gsap.registerPlugin(ScrollTrigger);

	const handleResize = () => {
		const newWindowWidth = window.innerWidth;
		if (windowWidth !== newWindowWidth) {
			calcViewportHeight();
			ScrollTrigger.refresh();
		}

		windowWidth = newWindowWidth;
	};

	window.onPreloaderPreCompleted = () => {
		handleResize();
	};

	onWindowResize(handleResize);
	calcViewportHeight();
	header();
	footer();
};

export default layout;
