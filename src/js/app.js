import gsap from 'gsap';
import Plyr from 'plyr';
import AnimCanvas from './components/AnimCanvas';
import layout from './layout/layout';
import { indexPage } from './pages';
import { articlePage } from './pages/article';
import { uiPage } from './pages/ui';
import { pageLoad } from './utils';
import { cursorAnimations } from './components/cursor-animations';
import { videoModal } from './components/video-modal';

const app = () => {
	layout();
	pageLoad(() => {
		indexPage();
		articlePage();
		uiPage();
		document.body.classList.add('body--loaded');

		/** SampleCanvas contructor initialization */

		const [openModal, closeModal] = videoModal();

		const sketch = new AnimCanvas({
			dom: document.querySelector('#canvas_container'),
			onVideoClick: openModal,
		});

		cursorAnimations();
	});
};

export default app;
