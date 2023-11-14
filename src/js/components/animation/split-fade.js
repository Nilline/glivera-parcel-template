import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import SplitText from '../../vendors/SplitText';

const splitFade = () => {
	const $titles = document.querySelectorAll('[class] h1, [class] h2, .js-split-fade');

	gsap.registerPlugin(ScrollTrigger, SplitText);

	$titles.forEach(($title) => {
		const $rows = new SplitText($title, { type: 'lines' });

		if (!$rows?.lines?.length) return;

		const timeline = gsap
			.timeline({ paused: true })
			.fromTo(
				$rows.lines,
				{
					yPercent: 50,
					// clipPath: 'polygon(0 0, 100% 0, 100% 0%, 0 0%)',
				},
				{
					yPercent: 0,
					stagger: 0.14,
					// clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
					duration: 0.8,
					ease: 'Power4.out',
				},
			)
			.fromTo(
				$rows.lines,
				{
					opacity: 0,
				},
				{
					opacity: 1,
					stagger: 0.14,
					duration: 1.2,
					ease: 'Power4.out',
				},
				'<',
			);

		ScrollTrigger.create({
			trigger: $title,
			scroller: window.scroller,
			start: 'top 90%',
			end: 'bottom 15%',
			markers: false,
			onEnter: () => timeline.play(),
			// onEnterBack: () => timeline.play(),
			// onLeave: () => timeline.reverse(),
			// onLeaveBack: () => timeline.reverse(),
		});
	});
};

export default splitFade;
