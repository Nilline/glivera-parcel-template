import Plyr from 'plyr';

export function videoModal() {
	const $modal = document.querySelector('.js-video-modal');
	let isFullScreen = false;

	let player = null;
	const BODY_VIDEO_MODAL_ACTIVE = 'body--video_modal_active';
	const BODY_VIDEO_MODAL_FULLSCREEN_ACTIVE = 'body--video_modal_fullscreen_active';

	const closeModal = (e) => {
		if (e.target.closest('.plyr__controls') || isFullScreen) return;

		$modal.removeAttribute('data-close-trigger');
		$modal.innerHTML = '';
		player?.destroy();
		window.removeEventListener('click', closeModal);
		document.body.classList.remove(BODY_VIDEO_MODAL_ACTIVE);
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
			$modal.addEventListener('click', closeModal);
			document.body.classList.add(BODY_VIDEO_MODAL_ACTIVE);
		});
		player.on('enterfullscreen', (event) => {
			isFullScreen = true;
			document.body.classList.add(BODY_VIDEO_MODAL_FULLSCREEN_ACTIVE);
		});
		player.on('exitfullscreen', (event) => {
			isFullScreen = false;
			document.body.classList.remove(BODY_VIDEO_MODAL_FULLSCREEN_ACTIVE);
			if (window.updateCanvas) window.updateCanvas();
		});
	};

	return [openModal, closeModal];
}

export default videoModal;
