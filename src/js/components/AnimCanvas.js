/* eslint-disable no-unreachable */
import gsap from 'gsap';
import * as T from 'three';

// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
// import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';

// import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader';
// import { ACESFilmicToneMappingShader } from 'three/examples/jsm/shaders/ACESFilmicToneMappingShader';
// import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass';
import { ExpandVideo } from './ExpandVideo';
/**
 *
 *
 * Template for creation a canvas with three.js
 * Describes the structure and sequence of functions for rendering
 * Contains useful developments often found in projects
 */

export default class AnimCanvas {
	constructor(options) {
		this.container = options.dom;
		this.onVideoClick = options.onVideoClick;
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

		window.updateCanvas = this.resize.bind(this);
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
		this.camera.position.set(0, 0, 100);

		// this.composer = new EffectComposer(this.renderer);
		// this.composer.addPass(new RenderPass(this.scene, this.camera));

		// const effect1 = new ShaderPass(ACESFilmicToneMappingShader);
		// // effect1.uniforms['scale'].value = 4;
		// this.composer.addPass(effect1);

		// const effect2 = new ShaderPass(RGBShiftShader);
		// effect2.uniforms['amount'].value = 0.0015;
		// this.composer.addPass(effect2);

		// const effect3 = new OutputPass();
		// this.composer.addPass(effect3);
	}

	// loadObjects() {}

	/** Setup Events */
	initEvents() {
		window.addEventListener('resize', this.resize.bind(this));
		window.addEventListener('scroll', this.scroll.bind(this));
	}

	/** Update environment on resize */
	resize() {
		this.updateEnv();
	}

	updateEnv() {
		this.scene.env.width = this.container.offsetWidth;
		this.scene.env.height = this.container.offsetHeight;
		this.camera.aspect = this.scene.env.width / this.scene.env.height;

		this.scene.env.size = { x: this.scene.env.height / this.scene.env.width, y: 1 };
		this.scene.env.initialScrollTop = document.documentElement.scrollTop / this.scene.env.width;
		this.renderer.setSize(this.scene.env.width, this.scene.env.height);
		this.camera.fov = this.getCameraFov();
		this.camera.updateProjectionMatrix();

		this.scene.children.forEach((mesh) => {
			if (mesh.resizeCallback) mesh.resizeCallback();
			// eslint-disable-next-line no-param-reassign
		});

		this.scroll();
	}

	scroll() {
		this.scene.env.scrollTop = document.documentElement.scrollTop / this.scene.env.width;
		this.scene.children.forEach((mesh) => {
			if (mesh.material?.uniforms?.uGlobalScrollPos)
				// eslint-disable-next-line no-param-reassign
				mesh.material.uniforms.uGlobalScrollPos.value = this.scene.env.scrollTop;
		});
	}

	/** Create and add meshes to the scene */
	addObjects() {
		this.position = new T.Vector3();
		this.direction = new T.Vector3();
		this.binormal = new T.Vector3();
		this.normal = new T.Vector3();
		this.position = new T.Vector3();
		this.lookAt = new T.Vector3();

		const path = new T.CatmullRomCurve3([
			new T.Vector3(40 / 4, -40 / 4, 0),
			new T.Vector3(40 / 4, 40 / 4, -50),
			new T.Vector3(-20 / 4, 40 / 4, 0),
		]);

		this.tubeGeometry = new T.TubeGeometry(path, 100, 0.1, 100, true);
		this.splineMesh = new T.Mesh(
			this.tubeGeometry,
			new T.MeshStandardMaterial({ color: new T.Color(0x00ff00) }),
		);

		this.ballMesh = new T.Mesh(
			new T.SphereGeometry(1),
			new T.MeshStandardMaterial({ color: new T.Color(0x0000ff) }),
		);
		this.ballMesh.position.set(40 / 4, -40 / 4, 0);
		this.position.copy(this.ballMesh.position);

		const light = new T.AmbientLight(0xffffff, 10);
		this.scene.add(light);

		// direction vector for movement

		// splineCamera.matrix.lookAt(splineCamera.position, lookAt, normal);
		// splineCamera.quaternion.setFromRotationMatrix(splineCamera.matrix);
		// renderer.render(scene, params.animationView === true ? splineCamera : camera);
		// this.splineMesh.rotation.y += 0.3;

		this.group = new T.Group();
		this.group.add(this.ballMesh);
		this.group.add(this.splineMesh);
		this.scene.add(this.group);
	}

	/** Сanvas drawing */
	render() {
		this.scene.env.time += 0.01;

		this.scene.children.forEach((mesh) => {
			if (mesh.material?.uniforms?.time)
				// eslint-disable-next-line no-param-reassign
				mesh.material.uniforms.time.value = this.scene.env.time;
		});

		window.requestAnimationFrame(this.render.bind(this));
		this.renderer.render(this.scene, this.camera);

		const time = Date.now();
		const speed = 10;
		const looptime = speed * 1000;
		const t = (time % looptime) / looptime;
		const scale = 1;

		this.tubeGeometry.parameters.path.getPointAt(t, this.position);
		this.position.multiplyScalar(scale);

		// interpolation

		const segments = this.tubeGeometry.tangents.length;
		const pickt = t * segments;
		const pick = Math.floor(pickt);
		const pickNext = (pick + 1) % segments;

		this.binormal.subVectors(this.tubeGeometry.binormals[pickNext], this.tubeGeometry.binormals[pick]);
		this.binormal.multiplyScalar(pickt - pick).add(this.tubeGeometry.binormals[pick]);

		this.tubeGeometry.parameters.path.getTangentAt(t, this.direction);
		const offset = 0;

		this.normal.copy(this.binormal).cross(this.direction);
		this.position.add(this.normal.clone().multiplyScalar(offset));

		this.ballMesh.position.copy(this.position);

		this.tubeGeometry.parameters.path.getPointAt(
			(t + 30 / this.tubeGeometry.parameters.path.getLength()) % 1,
			this.lookAt,
		);
		this.lookAt.multiplyScalar(scale);

		this.ballMesh.matrix.lookAt(this.ballMesh.position, this.lookAt, this.normal);
		this.ballMesh.quaternion.setFromRotationMatrix(this.ballMesh.matrix);

		this.group.rotation.y += 0.005;
	}
}

gsap.to('#some_element', {
	motionPath: {
		path: [{ x: 0, y: 0 }, { x: 20, y: 0 }, { x: 30, y: 50 }, { x: 50, y: 50 }],
		path: "M9,100c0,0,18-41,49-65",
		path: '#pathID',

		align: '#pathID',
		alignOrigin: [0.5, 0.5],
		autoRotate: true,

		start: 0.25,
		end: 0.75,
	},
});
