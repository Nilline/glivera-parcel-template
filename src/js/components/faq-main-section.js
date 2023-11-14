import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import { exist, onWindowResize } from '../utils/index';

const faqMainSection = () => {
	const SELECTORS = {
		accordionHead: '.js-accordion-head',
		accordionBody: '.js-accordion-body',
		accordionSubHead: '.js-accordion-sub-head',
	};

	const CLASSES = {
		activeState: 'accordion__item--active-mod',
		accordionSubClass: 'js-accordion-sub-head',
	};

	const accordion = ({ triggersSelector, activeStateName }) => {
		if (!exist(triggersSelector)) return;

		const $allTriggers = document.querySelectorAll(triggersSelector);
		const activeStateClass = activeStateName || CLASSES.activeState;
		const scrollTriggerRefreshDelay = 300;

		if (!$allTriggers.length) return;

		const scrollTriggerRefresh = () => {
			setTimeout(() => {
				ScrollTrigger.refresh();
			}, scrollTriggerRefreshDelay);
		};

		const closeAccordion = ({ $parentEl, $nextElementSibling, $trigger }) => {
			const $nextElemSibling = $nextElementSibling;
			$parentEl.classList.remove(activeStateClass);
			$nextElemSibling.style.maxHeight = null;
			$nextElementSibling.setAttribute('aria-hidden', 'true');
			$trigger.setAttribute('aria-expanded', 'false');
		};

		const closeAllAccordion = () => {
			$allTriggers.forEach(($item) => {
				closeAccordion({
					$parentEl: $item.parentNode,
					$nextElementSibling: $item.nextElementSibling,
					$trigger: $item,
				});
			});
		};

		const openAccordion = ({ $parentEl, $nextElementSibling, $trigger }) => {
			const $nextElemSibling = $nextElementSibling;
			const openAccordionDelay = 100;

			setTimeout(() => {
				closeAllAccordion();

				$parentEl.classList.add(activeStateClass);
				$nextElemSibling.style.maxHeight = $nextElementSibling.scrollHeight?.toString().concat('px');
				$nextElementSibling.removeAttribute('aria-hidden');
				$trigger.setAttribute('aria-expanded', 'true');

				if ($trigger.classList.contains(CLASSES.accordionSubClass)) {
					const $parentBody = $trigger.closest(SELECTORS.accordionBody);
					$parentBody.style.maxHeight = ($parentBody.scrollHeight + $nextElementSibling.scrollHeight)
						.toString()
						.concat('px');
				}
			}, openAccordionDelay);
		};

		const toggleAccordion = ($trigger) => {
			const accordionElements = {
				$parentEl: $trigger.parentNode,
				$nextElementSibling: $trigger.nextElementSibling,
				$trigger,
			};

			if (accordionElements.$parentEl.classList.contains(activeStateClass)) {
				closeAccordion(accordionElements);
				scrollTriggerRefresh();
			} else {
				openAccordion(accordionElements);
				scrollTriggerRefresh();
			}
		};

		$allTriggers.forEach(($item) => {
			$item.addEventListener('click', () => {
				toggleAccordion($item);
			});
		});

		onWindowResize(() => {
			$allTriggers.forEach(($item) => {
				const $parentEl = $item.parentNode;

				if (
					$parentEl.classList.contains(activeStateName) ||
					$parentEl.classList.contains(CLASSES.activeState)
				) {
					const $nextElementSibling = $item.nextElementSibling;
					$nextElementSibling.style.maxHeight = $nextElementSibling.scrollHeight?.toString().concat('px');
				}
			});
		});
	};

	accordion({
		triggersSelector: SELECTORS.accordionHead,
		activeStateName: 'faq_accordion__item--active-mod',
	});

	accordion({
		triggersSelector: SELECTORS.accordionSubHead,
		activeStateName: 'faq_accordion_sub__item--active-mod',
	});
};

export default faqMainSection;
