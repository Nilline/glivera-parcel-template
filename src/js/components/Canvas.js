/* eslint-disable no-unreachable */
import gsap from 'gsap';
import * as T from 'three';
import { ExpandVideo } from './ExpandVideo';
/**
 * Template for creation a canvas with three.js
 * Describes the structure and sequence of functions for rendering
 * Contains useful developments often found in projects
 */

export default class SampleCanvas {
	constructor(options) {
		this.container = options.dom;
		this.init();
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
		};
	}

	/** Setup Canvas */
	setupScene() {
		/** Rendering: */
		this.scene = new T.Scene();
		this.scene.env = this.env;
		this.renderer = new T.WebGLRenderer({
			antialias: true,
			precision: 'highp',
		});
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(this.scene.env.width, this.scene.env.height);
		this.renderer.setClearColor(0xeeeeee, 1);
		this.renderer.outputEncoding = T.sRGBEncoding;
		this.container.appendChild(this.renderer.domElement);

		/** User View: */
		const { atan, tan } = Math;

		const perspective = window.innerWidth; // start with perspective
		const fovDeg = () => (180 * (2 * atan(window.innerHeight / 2 / perspective))) / Math.PI;

		// const V_FOV_RAD = () => Math.PI * (fovDeg() / 180);
		// const TAN_HALF_V_FOV = () => tan(V_FOV_RAD() / 2);

		// const getDistanceFromCamera = (fitment = 'contain') => window.innerHeight / (2 * TAN_HALF_V_FOV());

		this.camera = new T.PerspectiveCamera(fovDeg(), window.innerWidth / window.innerHeight, 0.001, 1000);
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
		this.renderer.setSize(this.scene.env.width, this.scene.env.height);
		this.camera.aspect = this.scene.env.width / this.scene.env.height;
		this.camera.updateProjectionMatrix();
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
		const $triggers = document.querySelectorAll('.js-canvas-video-trigger');
		this.videosInstances = [];

		$triggers.forEach(($trigger, index) => {
			const $video = $trigger.querySelector('.js-canvas-video');

			this.videosInstances[index] = new ExpandVideo({
				relativeNode: $video,
				injectTarget: this.scene,
				scene: this.scene,
				triggerTarget: $trigger,
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

		window.requestAnimationFrame(this.render.bind(this));
		this.renderer.render(this.scene, this.camera);

		// this.scene.children.forEach((mesh) => {
		// 	if (mesh.material.uniforms.time)
		// 		// eslint-disable-next-line no-param-reassign
		// 		mesh.material.uniforms.time.value = this.scene.env.time;
		// });
	}
}
