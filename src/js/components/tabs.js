import ScrollTrigger from 'gsap/dist/ScrollTrigger';

function tabs({ trigger, content, triggerClass, contentClass }) {
	let triggerSelector = document.querySelectorAll(trigger);
	let blockSelector = document.querySelectorAll(content);

	const activeTriggerClass = `${triggerClass}--active_state`;
	const activeContentClass = `${contentClass}--active_state`;

	const hash = window.location.hash.substring(1);

	const handActiveTab = (index) => {
		document.querySelector(`.${activeTriggerClass}`)?.classList.remove(activeTriggerClass);
		document.querySelector(`.${activeContentClass}`)?.classList.remove(activeContentClass);

		document.querySelector(`.${triggerClass}[data-tab="${index}"]`).classList.add(activeTriggerClass);
		document.querySelector(`.${contentClass}[data-tab="${index}"]`).classList.add(activeContentClass);
		ScrollTrigger.refresh();
	};

	if (hash) {
		handActiveTab(hash);
	}

	if (triggerSelector.length && blockSelector.length) {
		triggerSelector.forEach((item) => {
			item.addEventListener('click', (e) => {
				e.preventDefault();
				let currentIndex = item.getAttribute('data-tab');
				handActiveTab(currentIndex);
			});
		});
	}
}

export default tabs;
