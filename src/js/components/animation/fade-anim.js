import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import { onWindowResize, exist } from '../../utils';

const fadeAnim = () => {
	const SELECTORS = {
		fadeItem: '.js-fade-item',
		articleContent: '.js-article-content',
		footerBottom: '.js-footer-bottom',
	};

	gsap.registerPlugin(ScrollTrigger);

	const $fadeItems = document.querySelectorAll(SELECTORS.fadeItem);
	const $articleItems = document.querySelectorAll(`${SELECTORS.articleContent} *`);
	const $allParagraphs = document.querySelectorAll('[class] p');
	const $excludedParagraphs = [`${SELECTORS.articleContent} p`, `${SELECTORS.footerBottom} p`];
	let tl = [];
	let tlArticle = [];
	let tlParag = [];
	let selectedParagraphs = [];

	if (!exist($fadeItems) && !exist($allParagraphs) && !exist($articleItems)) return;

	const fadeInit = (tl, $item, index) => {
		const currentTl = tl;

		currentTl[index] = gsap.timeline({ ease: 'power2.out' });
		currentTl[index].pause();

		currentTl[index].fromTo(
			$item,
			{
				opacity: 0,
			},
			{
				opacity: 1,
				duration: 0.8,
			},
		);

		setTimeout(() => {
			ScrollTrigger.refresh();
		}, 0);

		ScrollTrigger.create({
			trigger: $item,
			scroller: window.scroller,
			start: 'top 90%',
			end: 'bottom 15%',
			markers: false,
			onEnter: () => tl[index].play(),
			// onEnterBack: () => tl[index].play(),
			// onLeave: () => tl[index].reverse(),
			// onLeaveBack: () => tl[index].reverse(),
		});

		// onWindowResize(() => {
		// 	ScrollTrigger.refresh();
		// });
	};

	$fadeItems.forEach(($item, index) => {
		fadeInit(tl, $item, index);
	});

	$allParagraphs.forEach(($paragraph) => {
		if (!$paragraph.matches($excludedParagraphs)) {
			selectedParagraphs.push($paragraph);
		}
	});

	selectedParagraphs.forEach(($item, index) => {
		fadeInit(tlParag, $item, index);
	});

	$articleItems.forEach(($articleItem, index) => {
		fadeInit(tlArticle, $articleItem, index);
	});
};

export default fadeAnim;
