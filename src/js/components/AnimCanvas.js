/* eslint-disable no-unreachable */
import gsap from 'gsap';
import * as T from 'three';
import { ExpandVideo } from './ExpandVideo';
/**
 * Template for creation a canvas with three.js
 * Describes the structure and sequence of functions for rendering
 * Contains useful developments often found in projects
 */

export default class AnimCanvas {
	constructor(options) {
		this.container = options.dom;
		this.init();
	}

	get SELECTORS() {
		return {
			videoSection: '.js-canvas-video-section',
			video: '.js-canvas-video',
			videoPositionHelper: '.js-canvas-video-position-helper',
			videoPinTrigger: '.js-canvas-video-pin',
			videoPlayTrigger: '.js-canvas-video-play-trigger',
		};
	}

	/** Initialization */
	async init() {
		if (!this.container) return;

		this.setupEvironment();
		this.setupScene();

		// try {
		// 	await this.loadObjects();
		// } catch (e) {
		// 	console.log(e);
		// }

		this.addObjects();
		// this.addLights();
		// this.addGui();
		this.resize();
		this.scroll();
		this.render();
		this.initEvents();
	}

	/** Environment & Variables */
	setupEvironment() {
		this.env = {
			width: this.container.offsetWidth,
			height: this.container.offsetHeight,
			time: 0,
			scrollTop: 0,
			initialScrollTop: document.documentElement.scrollTop / this.container.offsetWidth,
			size: { x: this.container.offsetHeight / this.container.offsetWidth, y: 1 },
		};
	}

	getCameraFov() {
		const perspective = this.scene.env.width;
		return (180 * (2 * Math.atan(this.container.offsetHeight / 2 / perspective))) / Math.PI;
	}

	/** Setup Canvas */
	setupScene() {
		/** Rendering: */
		this.scene = new T.Scene();
		this.scene.env = this.env;
		this.renderer = new T.WebGLRenderer({
			alpha: true,
			antialias: true,
			precision: 'highp',
		});
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(this.scene.env.width, this.scene.env.height);
		this.renderer.setClearColor(0xff000000, 0);
		this.renderer.outputEncoding = T.sRGBEncoding;
		this.container.appendChild(this.renderer.domElement);

		/** User View: */

		// const V_FOV_RAD = () => Math.PI * (fovDeg() / 180);
		// const TAN_HALF_V_FOV = () => tan(V_FOV_RAD() / 2);

		// const getDistanceFromCamera = (fitment = 'contain') => this.container.offsetHeight / (2 * TAN_HALF_V_FOV());

		this.camera = new T.PerspectiveCamera(
			this.getCameraFov(),
			this.scene.env.width / this.scene.env.height,
			0.001,
			1000,
		);
		this.camera.position.set(0, 0, 1);
	}

	// loadObjects() {}

	/** Setup Events */
	initEvents() {
		window.addEventListener('resize', this.resize.bind(this));
		window.addEventListener('scroll', this.scroll.bind(this));
	}

	/** Update environment on resize */
	resize() {
		this.scene.env.width = this.container.offsetWidth;
		this.scene.env.height = this.container.offsetHeight;
		this.camera.aspect = this.scene.env.width / this.scene.env.height;

		this.scene.env.size = { x: this.scene.env.height / this.scene.env.width, y: 1 };
		this.scene.env.initialScrollTop = document.documentElement.scrollTop / this.scene.env.width;
		this.renderer.setSize(this.scene.env.width, this.scene.env.height);
		this.camera.updateProjectionMatrix();
		this.camera.fov = this.getCameraFov();

		this.scene.children.forEach((mesh) => {
			if (mesh.resizeCallback) mesh.resizeCallback();
			// eslint-disable-next-line no-param-reassign
		});
	}

	scroll() {
		this.scene.env.scrollTop = document.documentElement.scrollTop / this.scene.env.width;
		this.scene.children.forEach((mesh) => {
			if (mesh.material.uniforms.uGlobalScrollPos)
				// eslint-disable-next-line no-param-reassign
				mesh.material.uniforms.uGlobalScrollPos.value = this.scene.env.scrollTop;
		});
	}

	/** Create and add meshes to the scene */
	addObjects() {
		const $sections = document.querySelectorAll(this.SELECTORS.videoSection);
		this.videosInstances = [];

		$sections.forEach(($section, index) => {
			const $video = $section.querySelector(this.SELECTORS.video);
			const $videoPosHelper = $section.querySelector(this.SELECTORS.videoPositionHelper);
			const $videoPinTrigger = $section.querySelector(this.SELECTORS.videoPinTrigger);
			const $videoPlayTrigger = $section.querySelector(this.SELECTORS.videoPlayTrigger);

			this.videosInstances[index] = new ExpandVideo({
				relativeNode: $video,
				injectTarget: this.scene,
				scene: this.scene,
				posHelperNode: $videoPosHelper,
				pinTriggerNode: $videoPinTrigger,
				videoPlayTriggerNode: $videoPlayTrigger,
				textTextureUrl: $video.dataset.textTx,
			});
			this.videosInstances[index].createMesh();
			// this.videosInstances[index].loadVideo($video.dataset.src, () => {
			// 	console.log('loaded!'); //!
			// });
		});
	}

	/** Сanvas drawing */
	render() {
		this.scene.env.time += 0.01;

		this.scene.children.forEach((mesh) => {
			if (mesh.material.uniforms.time)
				// eslint-disable-next-line no-param-reassign
				mesh.material.uniforms.time.value = this.scene.env.time;
		});

		window.requestAnimationFrame(this.render.bind(this));
		this.renderer.render(this.scene, this.camera);

		// this.scene.children.forEach((mesh) => {
		// 	if (mesh.material.uniforms.time)
		// 		// eslint-disable-next-line no-param-reassign
		// 		mesh.material.uniforms.time.value = this.scene.env.time;
		// });
	}
}
