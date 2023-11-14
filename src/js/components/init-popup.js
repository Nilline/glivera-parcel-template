import { exist } from '../utils';
import 'ScssComponents/universal/popup.scss';

const initPopup = (btnSelector, popupSelector) => {
	const SELECTORS = {
		close: '.js-popup-close',
	};

	const CLASSNAMES = {
		popupActiveState: 'popup--open_state',
		bodyPopupOpenState: 'body--popup_active_mod',
	};

	const $btns = document.querySelectorAll(btnSelector);
	if (!exist($btns)) return null;

	const closePopup = ($popup) => {
		$popup.classList.remove(CLASSNAMES.popupActiveState);
		document.body.classList.remove(CLASSNAMES.bodyPopupOpenState);

		if (window.scrollSmoother) {
			window.scrollSmoother.paused(false);
		}
	};

	const openPopup = (e, $popup) => {
		e.preventDefault();
		$popup.classList.add(CLASSNAMES.popupActiveState);
		document.body.classList.add(CLASSNAMES.bodyPopupOpenState);

		if (window.scrollSmoother) {
			window.scrollSmoother.paused(true);
		}
	};

	const initEventListeners = ($btn, $popup) => {
		$btn.addEventListener('click', (e) => openPopup(e, $popup));

		$popup.addEventListener('click', (e) => {
			if (e.target === $popup) {
				closePopup($popup);
			}
		});

		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') {
				closePopup($popup);
			}
		});

		const $closeBtns = $popup.querySelectorAll(SELECTORS.close);
		if (!exist($closeBtns)) return;

		$closeBtns.forEach(($item) => {
			$item.addEventListener('click', () => closePopup($popup));
		});
	};

	$btns.forEach(($btn) => {
		const { popupId } = $btn.dataset;
		if (!popupId) return;

		const $popup = document.querySelector(`${popupSelector}[data-popup-id="${popupId}"]`);
		if (!exist($popup)) return;

		initEventListeners($btn, $popup);
	});

	return null;
};

export default initPopup;
