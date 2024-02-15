import gsap from 'gsap';
import { CURSOR_TRIGGER_ATTR } from '../utils/constants';

export function cursorAnimations() {
	const $cursor = document.querySelector('.js-cursor');
	let isCustomCursor = false;

	const pointer = {
		x: 0,
		y: 0,
		lastEvent: null,
	};

	const CLASSNAMES = {
		playState: 'body--custom_cursor_play_state',
		closeState: 'body--custom_cursor_close_state',
		optionState: 'body--custom_cursor_option_state',
	};

	gsap.set($cursor, {
		opacity: 0,
		scale: 0,
	});

	const handlePointerMove = (e) => {
		const deltaY = pointer.y - e.clientY;

		pointer.x = e.clientX;
		pointer.y = e.clientY;
		pointer.lastEvent = e;

		gsap.to($cursor, {
			x: pointer.x,
			y: pointer.y,
			rotate: gsap.utils.clamp(-45, 45, 25 * -deltaY),
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
		gsap.to($cursor, {
			opacity: 0,
			scale: 0,
			duration: 1.6,
			ease: 'elastic.out',
		});
		window.removeEventListener('pointermove', handlePointerMove);
	};

	const cursorEnterAnim = (e, cfg) => {
		isCustomCursor = true;
		gsap.to($cursor, {
			opacity: 1,
			scale: 1,
			duration: 1.6,
			ease: 'elastic.out',
			...cfg,
		});
		window.addEventListener('pointermove', handlePointerMove);
	};

	const toggleClassName = (className) => {
		document.body.classList.remove(CLASSNAMES.optionState);
		document.body.classList.remove(CLASSNAMES.closeState);
		document.body.classList.remove(CLASSNAMES.playState);
		if (className) document.body.classList.add(className);
	};

	const handlePlayEnter = (e) => {
		document.body.classList.add(CLASSNAMES.playState);
		cursorEnterAnim(e, {
			onStart: () => toggleClassName(CLASSNAMES.playState),
			delay: isCustomCursor ? 0.2 : 0,
		});
	};

	const handleCloseEnter = (e) => {
		cursorEnterAnim(e, {
			onStart: () => toggleClassName(CLASSNAMES.closeState),
			delay: isCustomCursor ? 0.2 : 0,
		});
	};

	const handleOptionEnter = (e) => {
		cursorEnterAnim(e, {
			onStart: () => toggleClassName(CLASSNAMES.optionState),
		});
	};

	const toggleActiveCursor = () => {
		toggleClassName();
		cursorLeaveAnim();
	};

	const handlePointerOver = (e = pointer.lastEvent) => {
		if (!e?.target) return;

		if (e.target.closest('.plyr__controls')) {
			toggleActiveCursor();
			handleOptionEnter();
		} else if (e.target.closest(`[${CURSOR_TRIGGER_ATTR.play}]`)) {
			toggleActiveCursor();
			handlePlayEnter();
		} else if (e.target.closest(`[${CURSOR_TRIGGER_ATTR.close}]`)) {
			toggleActiveCursor();
			handleCloseEnter();
		} else {
			isCustomCursor = false;
			toggleActiveCursor();
		}
	};

	window.addEventListener('pointerover', handlePointerOver);
	// window.addEventListener('scroll', handlePointerOver);
	window.updateCursor = handlePointerOver;
}

export default cursorAnimations;
