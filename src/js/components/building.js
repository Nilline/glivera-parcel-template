import tabs from './tabs';

// import 'ScssComponents/building.scss';
// import 'ScssComponents/home.scss';

const building = () => {
	const SELECTORS = {
		tabsTrigger: '.js-building-tab-trigger',
		tabsContent: '.js-building-tab-content',
	};

	const classNames = {
		tabTriggerClass: 'building__tabs_head_button',
		tabContentClass: 'building__tabs_item',
	};

	tabs({
		trigger: SELECTORS.tabsTrigger,
		content: SELECTORS.tabsContent,
		triggerClass: classNames.tabTriggerClass,
		contentClass: classNames.tabContentClass,
	});
};

export default building;
