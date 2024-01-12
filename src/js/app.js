import SampleCanvas from './components/sample-canvas';
import layout from './layout/layout';
import { indexPage } from './pages';
import { articlePage } from './pages/article';
import { uiPage } from './pages/ui';
import { pageLoad } from './utils';

const app = () => {
	layout();
	pageLoad(() => {
		indexPage();
		articlePage();
		uiPage();
		document.body.classList.add('body--loaded');

		/** SampleCanvas contructor initialization */

		console.log('123'); //!
		const sketch = new SampleCanvas({
			dom: document.querySelector('#container'),
		});
	});
};

export default app;
