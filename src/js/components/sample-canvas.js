/* eslint-disable no-unreachable */
import gsap from 'gsap';
import * as T from 'three';

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

		try {
			await this.loadObjects();
		} catch (e) {
			console.log(e);
		}

		this.addObjects();
		// this.addLights();
		// this.addGui();
		this.resize();
		this.render();
		this.initEvents();
	}

	/** Environment & Variables */
	setupEvironment() {
		this.width = this.container.offsetWidth;
		this.height = this.container.offsetHeight;
		this.time = 0;
	}

	/** Setup Canvas */
	setupScene() {
		/** Rendering: */
		this.scene = new T.Scene();
		this.renderer = new T.WebGLRenderer();
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(this.width, this.height);
		this.renderer.setClearColor(0xeeeeee, 1);
		this.renderer.outputEncoding = T.sRGBEncoding;
		this.container.appendChild(this.renderer.domElement);

		/** User View: */
		this.camera = new T.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.001, 1000);
		this.camera.position.set(0, 0, 5);
	}

	loadObjects() {
		const loader = new T.TextureLoader();

		const img1 = new Promise((resolve, reject) => {
			loader.load(
				'https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg',
				(data) => {
					this.tx1 = data;
					resolve();
				},
				() => {},
				(err) => {
					console.log(err);
					reject();
				},
			);
		});

		const img2 = new Promise((resolve, reject) => {
			loader.load(
				'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg',
				(data) => {
					this.tx2 = data;
					resolve();
				},
				() => {},
				(err) => {
					console.log(err);
					reject();
				},
			);
		});

		return Promise.all([img1, img2]);
	}

	/** Setup Events */
	initEvents() {
		window.addEventListener('resize', this.resize.bind(this));
	}

	/** Update environment on resize */
	resize() {
		this.width = this.container.offsetWidth;
		this.height = this.container.offsetHeight;
		this.renderer.setSize(this.width, this.height);
		this.camera.aspect = this.width / this.height;
		this.camera.updateProjectionMatrix();
	}

	/** Setup Mesh material */
	setMaterials() {
		this.material = new T.ShaderMaterial({
			//
			extensions: {
				derivatives: '#extension GL_OES_standard_derivatives : enable',
			},
			side: T.DoubleSide,
			depthTest: true,
			uniforms: {
				time: { type: 'f', value: 0 },
				resolution: { type: 'v4', value: new T.Vector4() },
				transparent: true,
				uTexture: { value: this.tx1 },
				uSize: { value: 1.5, type: 'f' },
			},
			// wireframe: true,
			// transparent: true, // если в текстурке используется альфа-канал
			vertexShader: `

				uniform float time;
				uniform float uSize;
				varying vec2 vUv;
				varying vec4 vPosition;
				float PI = 3.141592653589793238;

				void main() {

					vUv = uv;

					vPosition = modelViewMatrix * vec4( position, 1.0 );

					vPosition.xy += uSize / 2.;

					float xCoef = vPosition.x * vPosition.x;
					float yCoef = vPosition.y * vPosition.y;
					float diagCoef = xCoef * yCoef;

					float progress = clamp(time + time * diagCoef / 5., 0., 1.);

					vPosition.z = sin(PI / 2. * progress * 2.) * (xCoef / 4.);
					vPosition.x *= 1. - (sin(PI / 2. * progress)) * 2.;

					vPosition.y -= uSize / 2.;
					vPosition.z -= 3.;


					gl_Position = projectionMatrix * vPosition;
				}
			`,
			fragmentShader: `
				uniform sampler2D uTexture;
				varying vec2 vUv;

				void main()	{
					vec4 textureColor = texture2D(uTexture, vUv);
					gl_FragColor = textureColor;
				}
			`,
		});

		this.secondMaterial = this.material.clone();
		this.material.uniforms.uTexture.value = this.tx2;
	}

	/** Setup Mesh geometry */
	setGeometries() {
		this.geometry = new T.PlaneGeometry(1.5, 1.5, 50, 50);
	}

	/** Create and add meshes to the scene */
	addObjects() {
		this.setGeometries();
		this.setMaterials();

		this.plane = new T.Mesh(this.geometry, this.material);
		this.plane2 = new T.Mesh(this.geometry.clone(), this.secondMaterial);
		this.scene.add(this.plane);
		this.scene.add(this.plane2);

		gsap.fromTo(
			this.material.uniforms.time,
			{
				value: 0,
			},
			{
				value: 1,
				duration: 2,
				repeat: -1,
				ease: 'Power1.inOut',
			},
		);

		// this.plane.rotation.y = Math.PI / 1.9;
	}

	/** Сanvas drawing */
	render() {
		window.requestAnimationFrame(this.render.bind(this));
		this.renderer.render(this.scene, this.camera);
	}
}
