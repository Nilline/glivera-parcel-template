const preloader = () => {
	const $preloader = document.querySelector('.js-preloader');

	const $preloaderLogo = document.querySelector('.js-preloader-logo');
	const $preloaderImagesMainWrap = document.querySelector('.js-preloader-images-w');
	const $preloaderImagesWrap = document.querySelector('.js-preloader-images');
	const $preloaderImages = document.querySelectorAll('.js-preloader-image');
	const $preloaderHeroImageIn = document.querySelector('.js-preloader-hero-image-in');
	const $preloaderCounter = document.querySelector('.js-preloader-counter');

	if (
		!$preloader ||
		!$preloaderImagesMainWrap ||
		!$preloaderImagesWrap ||
		!$preloaderImages.length ||
		!$preloaderHeroImageIn
	)
		return () => {
			document.body.classList.add('body--loaded_state');
		};

	let loaded = false;
	let imagesTransitionCompleted = false;

	const goToLoadedState = () => {
		setTimeout(() => {
			$preloader.classList.add('preloader--loaded_state');
			setTimeout(() => {
				document.body.classList.add('body--preloaded_state');
				setTimeout(() => {
					window.scrollTo(0, 0);
					document.body.classList.add('body--loaded_state');
					setTimeout(() => {
						$preloader.style.display = 'none';
					}, 600);
				}, 600);
			}, 1200);
		}, 1200);
	};

	$preloaderImagesMainWrap?.classList.add('preloader__images_w--show_state');
	setTimeout(() => $preloaderLogo?.classList.add('preloader__logo_w--show_state'), 600);
	let index = 0;
	const imageTransitionLoop = () => {
		index += 1;
		setTimeout(() => {
			$preloaderImagesWrap.style.transform = `translate(0, ${-100 * index}%) translate(0, ${-24 * index}px)`;
			if (index !== $preloaderImages.length && !loaded) {
				imageTransitionLoop();
			} else {
				$preloaderHeroImageIn.classList.add('preloader__hero_image_in--show_state');
				if (loaded) {
					goToLoadedState();
				}
				imagesTransitionCompleted = true;
			}
		}, 1200);
		// if (index === $preloaderImages.length - 1 && !loaded) {
		// }
	};
	imageTransitionLoop();

	let progress = 0;
	let loadInterval;

	if ($preloaderCounter) {
		loadInterval = setInterval(() => {
			let percentProgress = `${(window.loadProgress || 0.15) * 100}`;

			if (progress < percentProgress) progress += 1;
			let textContent = progress.toString();
			if (textContent.length < 2) textContent = '0'.concat(textContent);
			$preloaderCounter.textContent = textContent.concat('%');
		}, 20);
	}

	const onPageLoad = () => {
		window.loadProgress = 1;
		setTimeout(() => {
			loaded = true;
			clearInterval(loadInterval);
			if (imagesTransitionCompleted) {
				goToLoadedState();
			}
		}, 10000);
	};

	// let timeline = gsap
	// 	.timeline()
	// 	.fromTo(
	// 		$preloaderImagesMainWrap,
	// 		{
	// 			clipPath: 'polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)',
	// 		},
	// 		{
	// 			clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0%  100%)',
	// 		},
	// 	)
	// 	.fromTo(
	// 		$preloaderLogo,
	// 		{
	// 			opacity: 0,
	// 		},
	// 		{
	// 			opacity: 1,
	// 			ease: 'Power1.out',
	// 		},
	// 	)
	// 	.set($preloaderHeroImageIn, {
	// 		y: $preloaderImagesWrap.clientHeight + 24,
	// 	});

	// const defaultEase = {
	// 	ease: 'Power3.inOut',
	// 	duration: 1.2,
	// 	delay: 0.8,
	// };

	// const prepareHeroState = () => {
	// 	if (heroPrepared) return;
	// 	heroPrepared = true;
	// 	timeline
	// 		.addLabel('prepare-hero-state')
	// 		.to(
	// 			$preloaderHeroImageIn,
	// 			{
	// 				y: 0,
	// 				...defaultEase,
	// 			},
	// 			'prepare-hero-state',
	// 		)
	// 		.to(
	// 			$preloaderImages,
	// 			{
	// 				yPercent: '-=100',
	// 				y: '-=24',
	// 				...defaultEase,
	// 				onComplete: () => {
	// 					state = 2;
	// 				},
	// 			},
	// 			'prepare-hero-state',
	// 		);
	// };

	// const heroState = () => {
	// 	if (heroCompleted) return;
	// 	heroCompleted = true;
	// 	timeline.to($preloader, {
	// 		opacity: 0,
	// 	});
	// };

	// const imageTransitionCompleted = () => {
	// 	if (loaded) {
	// 		timeline.pause();
	// 		prepareHeroState();
	// 		heroState();
	// 		timeline.seek('prepare-hero-state');
	// 		timeline.play();
	// 	}
	// };

	// $preloaderImages.forEach(($image, index) => {
	// 	if (index !== 0) {
	// 		timeline.to($preloaderImagesWrap, {
	// 			y: -24 * index,
	// 			yPercent: -100 * index,
	// 			...defaultEase,
	// 			onComplete: imageTransitionCompleted,
	// 		});
	// 	}

	// 	if (index === $preloaderImages.length - 1 && !loaded) {
	// 		prepareHeroState();
	// 	}
	// });

	// if (!$preloaderImages.length) prepareHeroState();
	// if (heroPrepared && !heroCompleted) {
	// 	heroState();
	// 	console.log('test'); //!
	// }

	return onPageLoad;
};

export default preloader;
