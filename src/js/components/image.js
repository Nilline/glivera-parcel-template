// import 'ScssComponents/image.scss';
import Plyr from 'plyr';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';
import { exist } from '../utils';
import 'ScssComponents/plyr.scss';

const image = () => {
	gsap.registerPlugin(ScrollToPlugin);

	const SELECTORS = {
		section: '.js-video-section',
		videoWrap: '.js-video-wrap',
		video: '.js-video',
		popup: '.js-video-popup',
		plyr: '.plyr',
		videoWrapper: '.disaster_relief_hero__video_wrapper',
	};

	const CLASSES = {
		activeVideo: 'video-active',
		initVideo: 'video-init',
		pausedVideo: 'video-paused',
		popup: 'js-video-popup',
	};

	const $sections = document.querySelectorAll(SELECTORS.section);
	const { body } = document;
	let videoArray = [];
	let popupsArray = [];
	let initScrollValue = 0;

	if (!exist($sections)) return;

	const detectiOS = () => {
		return (
			['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(
				window.navigator.platform,
			) ||
			(window.navigator.userAgent.includes('Mac') && 'ontouchend' in document)
		);
	};

	const addInitClasses = (item, body) => {
		const $item = item;

		body.classList.add(CLASSES.activeVideo);
		$item.style.opacity = 1;
		$item.style.pointerEvents = 'initial';

		if (window.scrollSmoother) window.scrollSmoother.paused(true);
	};

	const removeInitClasses = (item, body) => {
		const $item = item;

		body.classList.remove(CLASSES.activeVideo);
		$item.style.opacity = 0;
		$item.style.pointerEvents = 'none';

		if (window.scrollSmoother) window.scrollSmoother.paused(false);
	};

	const closePlayer = (e, $item) => {
		if (!exist(videoArray)) return;

		const $target = e.target;

		if ($target.classList.contains(CLASSES.popup) || e.key === 'Escape') {
			if (e.key === 'Escape' && exist(popupsArray)) {
				popupsArray.forEach(($popup) => removeInitClasses($popup, body));
			} else {
				removeInitClasses($item, body);
			}

			videoArray.forEach((video) => video.pause());
		}
	};

	const initPlayer = (e, $video, item, i) => {
		let $item = item;
		const $target = e.target;
		const $currentTarget = e.currentTarget;
		const isPopupClick = $target.classList.contains(CLASSES.popup);
		const isPaused = $currentTarget.classList.contains(CLASSES.pausedVideo);
		const isInit = $currentTarget.classList.contains(CLASSES.initVideo);
		const isBlockReinitPlyr = (videoArray[i] && !isPopupClick) || $target.closest(SELECTORS.plyr);
		const isRepeatOpenVideo = isPaused && !isInit;

		if (isBlockReinitPlyr) {
			$item = popupsArray[i];

			if (isRepeatOpenVideo) {
				addInitClasses($item, body);
				videoArray[i].play();
			}
			return;
		}

		if (isPopupClick) {
			closePlayer(e, $item);
			return;
		}

		let $currentVideo = $video;
		const dataSrc = $currentVideo.dataset.src;
		const provider = $currentVideo.dataset.plyrProvider;
		const isIos = detectiOS();

		if (dataSrc) {
			$currentVideo.setAttribute('src', dataSrc);
			$currentVideo.removeAttribute('data-src');
		}

		if (isIos) {
			initScrollValue = window.pageYOffset;

			window.addEventListener('scroll', () => {
				const scrollValue = window.scrollY;
				const differenceScrollValue = initScrollValue - scrollValue;
				const isNeedScroll =
					Math.abs(differenceScrollValue) > 5 && body.classList.contains(CLASSES.activeVideo);

				if (isNeedScroll) {
					const scrollValue = differenceScrollValue + window.scrollY;

					gsap.to(window, {
						duration: 0.5,
						ease: 'Sine.easeInOut',
						scrollTo: {
							y: scrollValue,
						},
					});
				}
			});
		}

		if (!videoArray[i]) {
			const $popup = $currentVideo.parentElement;
			const $clonePopup = $popup.cloneNode(true);

			$currentVideo = $clonePopup.querySelector(SELECTORS.video);
			body.insertAdjacentElement('beforeend', $clonePopup);

			popupsArray[i] = $clonePopup;

			setTimeout(() => {
				popupsArray[i].style.opacity = 1;
				popupsArray[i].style.pointerEvents = 'initial';

				popupsArray[i].addEventListener('click', (e) => {
					if (!e.target.closest(SELECTORS.plyr)) closePlayer(e, popupsArray[i]);
				});
			}, 0);
		}

		const video = new Plyr($currentVideo, {
			iconUrl: 'images/sprite/sprite.svg',
			invertTime: false,
			hideControls: false,
			muted: isIos,
			controls:
				dataSrc || provider === 'vimeo'
					? ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen']
					: [],
			youtube: { controls: 1 },
		});

		video.on('ready', () => {
			video.toggleControls(false);
			video.play();
		});

		video.on('play', () => {
			video.toggleControls(true);
			if (!$item.classList.contains(CLASSES.initVideo)) addInitClasses($item, body);
			$item.classList.remove(CLASSES.pausedVideo);
		});

		video.on('pause', () => {
			video.toggleControls(true);
			$item.classList.add(CLASSES.pausedVideo);
		});

		videoArray[i] = video;
	};

	const videoInitClickEventListener = ($section, i) => {
		const $video = $section.querySelector(SELECTORS.video);

		if (!exist($video)) return;

		$section.addEventListener('click', (e) => initPlayer(e, $video, $section, i));
		document.addEventListener('keyup', (e) => closePlayer(e, $section));
	};

	$sections.forEach(($section, i) => videoInitClickEventListener($section, i));
};

export default image;
