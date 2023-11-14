// components
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import gsap from 'gsap';
import chatWithUs from 'components/chat-with-us';
import textBlock from 'components/text-block';
import image from 'components/image';
import team from 'components/team';
import bioBlock from 'components/bio-block';
import blogList from 'components/blog-list';
import building from 'components/building';
import faqMainSection from 'components/faq-main-section';
import shopPlans from 'components/shop-plans';
import contactForm from 'components/contact-form';
import caseSection from 'components/case-section';
import contentSection from 'components/content-section';
import chatWithRenofi from 'components/chat-with-renofi';
import howItWorksMainSection from 'components/how-it-works-main-section';
import createYourDream from 'components/create-your-dream';
import dreamHome from 'components/dream-home';
import partnersSection from 'components/partners-section';
import liveSustainably from 'components/live-sustainably';
import newsList from 'components/news-list';
import gallery from 'components/gallery';
import singleArticleSection from 'components/single-article-section';
import sustainabilityBlock from 'components/sustainability-block';

import layout from 'layout/layout';
import { isTouchDevice, pageLoad } from './utils';
import fadeAnim from './components/animation/fade-anim';
import preloader from './components/preloader';
import initScrollSmoother from './components/init-scroll-smoother';
import { BREAKPOINTS, ENV_STATUS } from './utils/constants';
import splitFade from './components/animation/split-fade';

import checkoutSelect from './components/checkout-select';
import { intercomScript } from './components/intercom-widget';

const app = () => {
	const initLayout = layout();
	const isTouch = isTouchDevice();
	const isMobile = window.innerWidth < BREAKPOINTS.mediaPoint1 || isTouch;

	const settingScroll = () => {
		if (isMobile) {
			window.scroller = document.querySelector('.js-scroll-inner');
			document.documentElement.classList.add('touch_device_state');
		} else {
			initScrollSmoother();
		}
	};

	pageLoad(() => {
		settingScroll();

		if (window.sessionStorage.preloaderAnimationPlayed) {
			fadeAnim();
			splitFade();
			intercomScript();
		} else {
			window.onPreloaderCompleted = () => {
				fadeAnim();
				splitFade();
				intercomScript();
			};
		}

		chatWithUs();
		textBlock();
		image();
		team();
		bioBlock();
		blogList();
		building();
		faqMainSection();
		shopPlans();
		contactForm();
		caseSection();
		contentSection();
		chatWithRenofi();
		howItWorksMainSection();
		createYourDream();
		dreamHome();
		partnersSection();
		liveSustainably();
		newsList();
		gallery();
		singleArticleSection();
		sustainabilityBlock();
		checkoutSelect();

		const handleRefreshTrigger = () => {
			setTimeout(() => window.scrollSmoother?.refresh(), 200);
			setTimeout(() => window.scrollSmoother?.refresh(), 1500);
		};
		document.addEventListener('wpcf7submit', handleRefreshTrigger, false);
		document.addEventListener('wpcf7invalid', handleRefreshTrigger, false);
		document
			.querySelectorAll('form')
			.forEach((form) => form.addEventListener('submit', handleRefreshTrigger));

		// document.addEventListener('wpcf7spam', handleRefreshTrigger, false);
		// document.addEventListener('wpcf7mailsent', handleRefreshTrigger, false);
		// document.addEventListener('wpcf7mailfailed', handleRefreshTrigger, false);
		handleRefreshTrigger();
	});
};

export default app;
