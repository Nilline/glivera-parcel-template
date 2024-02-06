import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import * as T from 'three';

gsap.registerPlugin(ScrollTrigger);

export class NodeMesh {
	constructor(props) {
		this.props = {
			relativeNode: null,
			...props,
		};

		this.pinStart = 0;
		this.pinEnd = 0;
	}

	getScale(val) {
		return val / this.props.scene.env.width;
	}

	getSize() {
		this.size = {
			xScale: this.getScale(this.props.relativeNode.clientWidth),
			yScale: this.getScale(this.props.relativeNode.clientHeight),
		};
	}

	getPosition() {
		const { x, y } = this.props.relativeNode.getBoundingClientRect();

		this.position = {
			x: this.getScale(x) - this.size.xScale / 2,
			y:
				this.getScale(this.props.scene.env.height / 2 - y) -
				this.size.yScale / 2 -
				this.props.scene.env.initialScrollTop,
			z: 0,
		};
	}

	updatePosMatrix() {
		this.getSize();
		this.getPosition();

		const { x, y, z } = this.position;
		this.mesh?.position.set(x, y, z);

		const { xScale, yScale } = this.size;
		this.mesh?.scale.set(xScale, yScale, 1);
	}
}
