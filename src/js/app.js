import gsap from 'gsap';
import Plyr from 'plyr';
import AnimCanvas from './components/AnimCanvas';
import layout from './layout/layout';
import { indexPage } from './pages';
import { articlePage } from './pages/article';
import { uiPage } from './pages/ui';
import { pageLoad } from './utils';
import { CURSOR_TRIGGER_ATTR } from './utils/constants';

const app = () => {
	layout();
	pageLoad(() => {
		indexPage();
		articlePage();
		uiPage();
		document.body.classList.add('body--loaded');

		/** SampleCanvas contructor initialization */

		const $modal = document.querySelector('.js-video-modal');
		let player = null;

		const pointer = {
			x: 0,
			y: 0,
			lastEvent: null,
		};

		const $cursor = document.querySelector('.js-cursor');
		gsap.set($cursor, {
			opacity: 0,
			scale: 0,
		});

		const $playTriggers = document.querySelectorAll('.js-play-cursor-trigger');
		const BODY_CURSOR_PLAY_STATE = 'body--custom_cursor_play_state';
		const BODY_CURSOR_CLOSE_STATE = 'body--custom_cursor_close_state';
		const BODY_CURSOR_OPTION_STATE = 'body--custom_cursor_option_state';
		const BODY_VIDEO_MODAL_ACTIVE = 'body--video_modal_active';

		const handlePointerMove = (e) => {
			const deltaY = pointer.y - e.clientY;

			pointer.x = e.clientX;
			pointer.y = e.clientY;

			gsap.to($cursor, {
				x: pointer.x,
				y: pointer.y,
				rotate: 25 * -deltaY,
				ease: 'elastic.out',
				duration: 1.6,
				onComplete: () => {
					gsap.to($cursor, {
						rotate: 0,
						ease: 'elastic.out',
						duration: 1.6,
					});
				},
			});
		};

		const cursorLeaveAnim = () => {
			pointer.lastEvent = null;

			gsap.to($cursor, {
				opacity: 0,
				scale: 0,
				duration: 1.6,
				ease: 'elastic.out',
			});
			window.removeEventListener('pointermove', handlePointerMove);
		};

		const cursorEnterAnim = (e) => {
			pointer.lastEvent = e;

			gsap.to($cursor, {
				opacity: 1,
				scale: 1,
				duration: 1.6,
				ease: 'elastic.out',
			});
			window.addEventListener('pointermove', handlePointerMove);
		};

		const handlePlayLeave = () => {
			cursorLeaveAnim();
			document.body.classList.remove(BODY_CURSOR_PLAY_STATE);
		};

		const handlePlayEnter = (e) => {
			document.body.classList.add(BODY_CURSOR_PLAY_STATE);
			document.body.classList.remove(BODY_CURSOR_CLOSE_STATE);
			cursorEnterAnim(e);
			e.target.addEventListener('pointerout', handlePlayLeave);
		};

		const handleCloseLeave = () => {
			cursorLeaveAnim();
			document.body.classList.remove(BODY_CURSOR_CLOSE_STATE);
		};

		const handleCloseEnter = (e) => {
			document.body.classList.remove(BODY_CURSOR_PLAY_STATE);
			document.body.classList.add(BODY_CURSOR_CLOSE_STATE);
			cursorEnterAnim(e);
			e.target.addEventListener('pointerout', handleCloseLeave);
		};

		const handleOptionLeave = () => {
			document.body.classList.remove(BODY_CURSOR_OPTION_STATE);
		};

		const handleOptionEnter = (e) => {
			document.body.classList.add(BODY_CURSOR_OPTION_STATE);
			e.target.addEventListener('pointerout', handleOptionLeave);
		};

		const checkIsCursorActive = () => {
			console.log(pointer.lastEvent?.target); //!
			if (pointer.lastEvent?.target) {
				if (pointer.lastEvent.target.closest(`[${CURSOR_TRIGGER_ATTR.play}]`)) {
					handlePlayEnter(pointer.lastEvent);
				} else {
					handlePlayLeave();
				}

				if (pointer.lastEvent.target.dataset.closeTrigger) {
					handleCloseEnter(pointer.lastEvent);
				} else {
					handleCloseLeave();
				}
			}
		};

		if ($cursor) {
			window.addEventListener('scroll', checkIsCursorActive);
			$playTriggers.forEach(($trigger) => $trigger.addEventListener('pointerover', handlePlayEnter));
			$modal?.addEventListener('pointerover', handleCloseEnter);
		}

		const closeModal = () => {
			$modal.removeAttribute('data-close-trigger');
			$modal.innerHTML = '';
			player?.destroy();
			window.removeEventListener('click', closeModal);
			document.body.classList.remove(BODY_VIDEO_MODAL_ACTIVE);
			checkIsCursorActive();
		};

		const openModal = (src) => {
			if (!$modal) return;

			const $video = document.createElement('video');
			$video.src = src;

			$modal.append($video);
			$modal.setAttribute('data-close-trigger', 'true');
			player = new Plyr($video, {
				invertTime: false,
				hideControls: false,
				autoplay: true,
			});

			player.on('ready', (event) => {
				const $plyrControls = $modal.querySelector('.plyr__controls');
				$plyrControls?.addEventListener('pointerover', handleOptionEnter);
				window.addEventListener('click', closeModal);
				document.body.classList.add(BODY_VIDEO_MODAL_ACTIVE);

				checkIsCursorActive();
			});
		};

		const sketch = new AnimCanvas({
			dom: document.querySelector('#canvas_container'),
			onVideoClick: openModal,
		});
	});
};

export default app;
