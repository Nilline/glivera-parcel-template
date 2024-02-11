import * as T from 'three';
import dat from 'dat.gui';

import gsap from 'gsap';

import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

import { NodeMesh } from './NodeMesh';

export class ExpandVideo extends NodeMesh {
	constructor(props) {
		super(props);

		this.props = {
			relativeNode: null,
			injectTarget: null,
			posHelperNode: null,
			pinTriggerNode: null,
			videoPlayTriggerNode: null,
			...props,
		};

		this.handleAnimationTick = this.handleAnimationTick.bind(this);
		this.updatePosMatrix = this.updatePosMatrix.bind(this);

		this.animationPinDist = this.props.scene.env.height;
	}

	setGeometry() {
		this.getSize();

		this.geometry = new T.PlaneGeometry(1, 1, 50, 50);
	}

	setMaterial() {
		this.material = new T.ShaderMaterial({
			//
			extensions: {
				derivatives: '#extension GL_OES_standard_derivatives : enable',
			},
			side: T.DoubleSide,
			depthTest: true,
			transparent: true,
			uniforms: {
				time: { type: 'f', value: 0 },
				uPageOffsetY: { type: 'f', value: this.position.y },
				uGlobalScrollPos: { type: 'f', value: 0 },
				uAnimDist: { type: 'f', value: this.getScale(this.animationPinDist) },
				uProgress: { type: 'f', value: 0 },

				uStartVideoPosition: { type: 'v2', value: new T.Vector2(0, 0) },
				uEndVideoPosition: { type: 'v2', value: new T.Vector2(0, 0) },

				uStartVideoSize: {
					type: 'v2',
					value: new T.Vector2(this.size.xScale, this.size.yScale),
				},
				uEndVideoSize: {
					type: 'v2',
					value: new T.Vector2(this.size.xScale * 2, this.size.yScale * 2),
				},

				uPosition: { type: 'v3', value: new T.Vector3(0, 0, 0) },
				uStartColor: { type: 'v3', value: new T.Vector3(0.4, 0.4, 1) },
				uTexture: { value: new T.VideoTexture(this.props.relativeNode) },
				u_radialCenter: { type: 'v2', value: new T.Vector2(0.5, 0.5) },

				uBorderRadius: { type: 'f', value: 0.02 },
				uQuaternion: { type: 'v4', value: new T.Quaternion(0, 0, 0, 0) },
				uScale: { type: 'v3', value: new T.Vector3(1, 1, 1) },
				uAnimPivot: { type: 'v2', value: new T.Vector2(0.3, 0) },
				// uAnimPivot: { type: 'v2', value: new T.Vector2(0.5, -0.5) },
				uEndAnimAspectScale: { type: 'f', value: 1 },
			},
			// wireframe: true,
			// transparent: true, // если в текстурке используется альфа-канал
			vertexShader: `
				uniform vec3 uPosition;
				uniform vec4 uQuaternion;
				uniform vec3 uScale;
				uniform vec2 uStartVideoPosition;
				uniform vec2 uStartVideoSize;
				uniform vec2 uEndVideoPosition;
				uniform vec2 uEndVideoSize;
				uniform vec2 uAnimPivot;
				uniform float uProgress;
				uniform float uAnimDist;
				uniform float uGlobalScrollPos;
				varying vec2 vUv;
				varying vec2 v_domWH;
				varying float v_showRatio;
				uniform float uBorderRadius;
				uniform float uPageOffsetY;
				uniform float time;

				vec3 qrotate(vec4 q,vec3 v){
					return v+2.*cross(q.xyz,cross(q.xyz,v)+q.w*v);
				}
				vec3 getBasePosition(in vec3 pos,in vec2 domWH){
					vec3 basePos=vec3(pos.xy * domWH - uAnimPivot, pos.z);
					return basePos;
				}
				float linearStep(float edge0,float edge1,float x){
					return clamp((x-edge0)/(edge1-edge0),0.0,1.0);
				}
				vec3 getScreenPosition(in vec3 basePos,in vec2 domXY){
					vec3 newPos = uPosition;

					vec3 screenPos=qrotate(uQuaternion,basePos*uScale)+vec3(uAnimPivot.xy,0.);
					screenPos=(screenPos+vec3(domXY,0.)+newPos)*vec3(1.,-1.,1.);
					return screenPos;
				}

				void main() {
					float placementWeight=1.-(pow(position.x*position.x,0.75)+pow(1.-position.y,1.5))/2.;
					v_showRatio=(smoothstep(placementWeight*0.3,0.7+placementWeight*0.3,uProgress - uBorderRadius));

					vec2 startPos = uStartVideoPosition;
					startPos -= uStartVideoSize / 2.;


					vec2 domXY=mix(startPos,uEndVideoPosition,v_showRatio);
					vec2 domWH=mix(uStartVideoSize,uEndVideoSize,v_showRatio);
					domXY.x+=mix(domWH.x,0.,cos(v_showRatio*3.1415926*2.)*0.5+0.5)*0.1;
					vec3 basePos=getBasePosition(position,domWH);
					float rot=(smoothstep(0.,1.,v_showRatio)-v_showRatio)*-0.5;
					vec3 rotBasePos=qrotate(vec4(0.,0.,sin(rot),cos(rot)),basePos);
					vec3 screenPos=getScreenPosition(rotBasePos,domXY);

					vec4 pos1 = modelViewMatrix*vec4(screenPos,1.0);
					pos1.y += uGlobalScrollPos;
					pos1.y -= uAnimDist * uProgress;
					pos1.y -= uPageOffsetY;
					vec4 pos = projectionMatrix * pos1;

					gl_Position = pos;
					vUv=vec2(uv.x,1.-uv.y);
					v_domWH=domWH;
				}
			`,
			fragmentShader: `

				uniform vec3 uStartColor;
				uniform sampler2D uTexture;
				uniform vec2 u_radialCenter;
				uniform float uProgress;
				uniform float uBorderRadius;
				uniform float uEndAnimAspectScale;
				uniform float time;
				varying vec2 vUv;
				varying vec2 v_domWH;
				varying float v_showRatio;
				float PI = 3.141592653589793238;

				// #include <getBlueNoise>
				float linearStep(float edge0,float edge1,float x){
					return clamp((x-edge0)/(edge1-edge0),0.0,1.0);
				}
				float sdRoundedBox(in vec2 p,in vec2 b,in float r){
					vec2 q=abs(p)-b+r;
					return min(max(q.x,q.y),0.0)+length(max(q,0.0))-r;
				}
				float getRoundedCornerMask(vec2 uv,vec2 size,float radius,float ratio){
					vec2 halfSize=size*0.5;
					float maxDist=length(halfSize);
					float minSize=min(halfSize.x,halfSize.y);
					float maxSize=max(halfSize.x,halfSize.y);
					float t=ratio*maxDist;
					radius=mix(minSize*linearStep(0.,minSize,t),radius,linearStep(maxSize,maxDist,t));
					halfSize=min(halfSize,vec2(t));
					float d=sdRoundedBox((uv-.5)*v_domWH,halfSize,radius);
					return smoothstep(0.,0.-fwidth(d),d);
				}

				vec3 getMap (vec2 uv) {
					vec2 baseUv = uv;
					float toRadialCenterDist=length((baseUv-u_radialCenter)*vec2(v_domWH.x/v_domWH.y,1.));
					baseUv.y=(baseUv.y-.5)*mix(1.,uEndAnimAspectScale,v_showRatio)+0.5;
					vec3 color=texture2D(uTexture,baseUv).rgb;
					return color;
				}


				vec3 rgb2hsv (vec3 c) {
					vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
					vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
					vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
					float d = q.x - min(q.w, q.y);
					float e = 1.0e-10;
					return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
				}

				vec3 hsv2rgb(vec3 c) {
					vec4 K = vec4(1.0, 2.0/3.0, 1.0 / 3.0, 3.0);
					vec3 p = abs(fract (c.xxx + K.xyz) * 6.0 - K.www);
					return c.z * mix(K.xxx, clamp(p -	K.xxx, 0.0, 1.0), c.y);
				}

				void main()	{
					float imageAlpha = getRoundedCornerMask(vUv,v_domWH,uBorderRadius,1.0);

					float progress = 0.5;

					float pixeletedStrength = 70.;
					vec2 pixelatedUV = floor(vUv * pixeletedStrength + 1.) / pixeletedStrength;
					vec4 clearColor = vec4(getMap(vUv), imageAlpha);

					vec2 position = vUv;
					// float trans = smoothstep(0., 1., position.y + (1. - 2. * progress) + sin(position.x * 4. + progress * 69. + time) * mix(0.3,.1,abs(0.5 - position.x)) * 0.5 * smoothstep(0., 0.2, progress));
					float trans = vUv.x;

					// float mixForUV = (1. - trans) * 50. * progress;
					float dist = 2. - distance(vec2(0.5), vUv) * 2.;
					float mixForUV = abs(sin(time)) * dist * uProgress;

					vec3 rainbow = vec3(1., .15, .15);
					vec3 hsv = rgb2hsv(rainbow);
					hsv.x += 0.1 * (vUv.y + trans - progress);
					rainbow = hsv2rgb(hsv);


					// vec3 pxColorV3 = mix(getMap(pixelatedUV), vec3(1., 1., 1.), 0.5 * smoothstep(0.3, 0., abs(0.05 - clearColor.r)));
					vec3 pxColorV3 = getMap(pixelatedUV);
					vec4 pixelatedColor = vec4(pxColorV3, imageAlpha);
					// vec4 pixelatedColor = clearColor;
					// vec4 pixelatedColor = vec4(0., 1., .5, imageAlpha);

					vec4 mixedColor = mix(clearColor, clearColor, mixForUV);


					float xCenter = 1. - abs(vUv.x - 0.5) * 2. + 0.3;
					float a = vUv.x;
					float count = 20.;
					float dist2 = distance(0.5, vUv.x) * 2.;
					float height = 200. ;
					float heightMod = height - 50. * (1. - dist2);
					float center = 0.5;
					float centerOffset = 0.1;

					float s1 = sin(a * count + time * 2.) * xCenter ;
					float s2 = sin(a * count + time * 2. + PI) * xCenter ;
					float test = mix(s1, s2, sin(time / 2.) * 2.);
					float wave1 = test / heightMod + center;
					float wave2 = test / heightMod + center ;

					// mixedColor.a = smoothstep(wave1, wave2, vUv.y);

					if (vUv.y < wave1 + centerOffset && vUv.y > wave2 - centerOffset) {
						mixedColor = pixelatedColor;
						mixedColor.a = smoothstep(0.1,1., pixelatedUV.y);
						mixedColor.a *= smoothstep(0.,.2, pixelatedUV.x);
						mixedColor.a *= 1. - smoothstep(0.8, 1., pixelatedUV.x);
					}
					// if (vUv.y < wave1 + centerOffset && vUv.y > wave2 - centerOffset) {
					// 	mixedColor = vec4(vec3(0.), 1.);
					// }

					gl_FragColor = mixedColor;
				}
			`,
		});
	}

	// pixelatedColor.a = min(trans * clearColor.b, imageAlpha);

	// gl_FragColor=vec4(tintedColor,imageAlpha);

	// vec3 tintedEffect=max(uStartColor,vec3(dot(clearColor,vec3(0.299,0.587,0.114))));
	// vec3 tintedColor=mix(tintedColor,clearColor,v_showRatio);
	// gl_FragColor=vec4(tintedColor,imageAlpha);

	updateUniforms() {
		this.mesh.material.uniforms.uStartVideoSize.value = new T.Vector2(0.5, 0.5);
		this.mesh.material.uniforms.uEndVideoSize.value = new T.Vector2(1, 1);
		this.mesh.material.uniforms.uAnimDist.value = this.getScale(this.animationPinDist);
		this.mesh.material.uniforms.uPageOffsetY.value = -this.position.y;
		this.mesh.material.uniforms.uProgress.value = this.timeline?.scrollTrigger.progress || 0;
	}

	addGui() {
		let that = this;
		this.guiSettings = {
			xRotation: 0,
		};

		this.gui = new dat.GUI();
		// const controller = this.gui.add(this.settings, 'xRotation', -1, 1, 0.01);
		// controller.onChange((val) => {
		// 	console.log(val);
		// });
	}

	setVideo(videoTexture) {}

	async loadVideo({ src, onComplete }) {
		const loader = new T.TextureLoader();

		loader.load(
			src,
			(videoTexture) => {
				this.setVideo(videoTexture);
				onComplete();
			},
			() => {},
			(err) => {
				console.error(err);
			},
		);
	}

	setAnimation() {
		this.timeline = gsap
			.timeline({
				paused: true,
				duration: 1,
				onUpdate: () => {
					this.handleAnimationTick(this.timeline.scrollTrigger);
				},
			})
			.addLabel('start')
			.to(
				{},
				{
					ease: 'sine.inOut',
					duration: 1,
				},
				'start',
			)
			.fromTo(
				this.props.videoPlayTriggerNode,
				{
					opacity: 0,
				},
				{
					opacity: 1,
					duration: 0.3,
					pointerEvents: 'initial',
					ease: 'sine.inOut',
				},
				'start+=0.7',
			);
		this.scrollTrigger = ScrollTrigger.create({
			trigger: this.props.posHelperNode,
			pin: this.props.pinTriggerNode,
			start: 'center center',
			end: `center+=${this.animationPinDist} center`,
			pinType: 'fixed',
			animation: this.timeline,
			scrub: true,
			snap: true,
		});
	}

	handleAnimationTick({ progress }) {
		if (this.mesh?.material) this.mesh.material.uniforms.uProgress.value = progress;
	}

	handleResize() {
		this.updatePosMatrix();
		this.updateUniforms();

		ScrollTrigger.refresh();
	}

	createMesh() {
		if (
			!this.props.relativeNode ||
			!this.props.injectTarget ||
			!this.props.posHelperNode ||
			!this.props.pinTriggerNode
		)
			return;

		this.setGeometry();
		this.setMaterial();
		this.mesh = new T.Mesh(this.geometry, this.material);
		this.updatePosMatrix();
		this.updateUniforms();
		this.props.injectTarget?.add(this.mesh);

		this.setAnimation();
		this.mesh.resizeCallback = this.handleResize.bind(this);
		this.addGui();
	}

	destroy() {
		this.props.injectTarget?.remove(this.mesh);
	}
}
