import { onWindowScroll, exist } from '../utils';

export const header = () => {
	const SELECTORS = {
		header: '.header',
		menuTrigger: '.js-header-menu-trigger',
		menu: '.js-header-menu',
	};

	const CLASSNAMES = {
		bodyOpenMenuState: 'body--open_menu_state',
		headerScrollState: 'header--scroll_state',
		headerScrollPos: 'header--pos_state',
	};

	const $body = document.body;
	const $header = document.querySelector(SELECTORS.header);
	const $menuTriggers = document.querySelectorAll(SELECTORS.menuTrigger);
	let prevScrollPos = window.scrollY;

	let isMenuOpen = false;

	const openMenu = () => {
		$body.classList.add(CLASSNAMES.bodyOpenMenuState);
		isMenuOpen = true;

		if (window.scrollSmoother) {
			window.scrollSmoother.paused(true);
		}
	};
	const closeMenu = () => {
		$body.classList.remove(CLASSNAMES.bodyOpenMenuState);
		isMenuOpen = false;

		if (window.scrollSmoother) {
			window.scrollSmoother.paused(false);
		}
	};

	const handleTriggerClick = () => {
		if (!isMenuOpen) {
			openMenu();
		} else {
			closeMenu();
		}
	};

	const headerScroll = (windowScrollTop) => {
		if (windowScrollTop > 10 && !$header.classList.contains(CLASSNAMES.headerScrollState)) {
			$header.classList.add(CLASSNAMES.headerScrollState);
		} else if (windowScrollTop <= 10 && $header.classList.contains(CLASSNAMES.headerScrollState)) {
			$header.classList.remove(CLASSNAMES.headerScrollState);
		}

		if (prevScrollPos > windowScrollTop || windowScrollTop < 10) {
			$header.classList.remove(CLASSNAMES.headerScrollPos);
		} else if (prevScrollPos < windowScrollTop) {
			$header.classList.add(CLASSNAMES.headerScrollPos);
		}

		prevScrollPos = window.scrollY;
	};

	if (!exist($header)) return;

	onWindowScroll(headerScroll);

	if (!exist($menuTriggers)) return;

	$menuTriggers.forEach(($trigger) => {
		$trigger.addEventListener('click', () => {
			handleTriggerClick();
		});
	});

	document.addEventListener('click', (e) => {
		const isClosest = e.target.closest(SELECTORS.menu) || e.target.closest(SELECTORS.menuTrigger);

		if (isMenuOpen && !isClosest) {
			closeMenu();
		}
	});
};
