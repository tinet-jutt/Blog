class Particle {
	constructor(props) {
		this.x = 0;
		this.y = 0;
		this.vx = 0;
		this.vy = 0;
		this.finalX = 0;
		this.finalY = 0;
		this.r = 1;
		this.fillStyle = '#000';
		this.strokeStyle = '#000';
		Object.assign(this, props);
    }
	render(ctx) {
		const { x, y, r, fillStyle, strokeStyle } = this;
		ctx.save();
		ctx.translate(x, y);
		ctx.fillStyle = fillStyle;
		ctx.strokeStyle = strokeStyle;
		ctx.beginPath();
		ctx.arc(0, 0, r, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.fill();
		ctx.restore();
		return this;
	}
}

class ParticleSystem {
	constructor(props) {
		this.nextFont = this.nextFont.bind(this);
		this.oCanvas = document.createElement('canvas');
		this.fontDataList = null;
		this.currentFontIndex = 0;
		this.font = '💕';
		this.color = 'red';
		this.container = null;
		this.width = 200;
		this.height = 200;
		this.size = 0.8;
		//粒子未扩散之前的范围
		this.range = 0.5;
		//粒子密度
		this.density = 4;
		Object.assign(this, props);
		this.init();
		return this;
	}

	setCanvasSize() {
		const { width, height, oCanvas } = this;
		oCanvas.setAttribute('width', width);
		oCanvas.setAttribute('height', height);
		this.ctx = oCanvas.getContext('2d');
	}

	setFont() {
		const { height, width, size, font, ctx } = this;
		ctx.clearRect(0, 0, width, height);
		ctx.fillStyle = '#000';
		ctx.font = 'blod 10px Arial';
		const measure = ctx.measureText(font);
		const lineHeight = 7;
		const fSize = Math.min(height * size * 10 / lineHeight, width * size * 10 / measure.width);
		ctx.save();
		ctx.font = `bold ${fSize}px Arial`;
		const measureResize = ctx.measureText(font);
		const left = (width - measureResize.width) / 2;
		const bottom = (height + fSize / 10 * lineHeight) / 2;
		ctx.fillText(font, left, bottom);
		this.getImageData();
		ctx.restore();
	}

	setImage() {
		const { height, width, font, ctx } = this;
		ctx.clearRect(0, 0, width, height);
		ctx.drawImage(font, 0, 0, width, height);
		this.getImageData();
	}

	getImageData() {
		const { ctx, color, range, width, height, density } = this;
		const data = ctx.getImageData(0, 0, width, height);
		const particleList = [];
		for (let x = 0, width = data.width, height = data.height; x < width; x += density) {
			for (let y = 0; y < height; y += density) {
				const currentX = (width - width * range) / 2 + Math.random() * width * range;
				const currentY = (height - height * range) / 2 + Math.random() * height * range;
				const i = (y * width + x) * 4;
				if (data.data[i + 3]) {
					particleList.push(
						new Particle({
							x: currentX,
							y: currentY,
							finalX: x,
							finalY: y,
							fillStyle: color,
							strokeStyle: color
						})
					);
				}
			}
		}
		this.particleList = particleList;
		this.drawParticle();
	}

	drawParticle() {
		const { particleList, ctx, width, height } = this;
		if (!particleList) return false;
		ctx.clearRect(0, 0, width, height);
		const spring = 0.01;
		const FRICTION = 0.88;
		particleList.forEach((item, index) => {
			item.vx += (item.finalX - item.x) * spring;
			item.vy += (item.finalY - item.y) * spring;
			item.x += item.vx;
			item.y += item.vy;
			item.vx *= FRICTION;
			item.vy *= FRICTION;
			item.render(ctx);
		});
	}

	animate() {
		const _this = this;
		let startTime = +new Date();
		(function move() {
			const { currentFontIndex, fontDataList } = _this;
			let endTime = +new Date();
			let interTime = endTime - startTime;
			let lifetime = fontDataList[currentFontIndex] && fontDataList[currentFontIndex].lifetime;
			if (interTime >= lifetime) {
				_this.nextFont();
				startTime = +new Date();
			}
			_this.drawParticle();
			requestAnimationFrame(move);
		})();
	}

	nextFont() {
		const { fontDataList, loop } = this;
		const _this = this;
		Object.entries(fontDataList[this.currentFontIndex]).forEach(([ key, value ]) => {
			_this[key] = value || _this.defaultValue(key);
		});
		if (typeof _this.font == 'string') _this.setFont();
		if (typeof _this.font == 'object') _this.setImage();
		this.currentFontIndex += 1;
		if (fontDataList.length <= this.currentFontIndex) {
			if (!loop) return false;
			this.currentFontIndex = 0;
		}
	}

	defaultValue(key) {
		const defaultValue = {
			font: '💕',
			color: 'red',
			size: 0.8
		};
		return defaultValue[key];
	}

	appendCanvas() {
		const { container, oCanvas } = this;
		if (!container) throw 'Need parameter container';
		container.appendChild(oCanvas);
	}

	init() {
		this.setCanvasSize();
		this.animate();
		this.appendCanvas();
	}
}

function loadImg(src) {
	return new Promise((res, rej) => {
		let oImg = new Image();
		oImg.src = src;
		oImg.onload = () => res(oImg);
		oImg.onerror = (err) => rej(err);
	});
}

(async () => {
	const oImg4 = await loadImg('./images/1.png');
	let fontList = [
		{
			font: '3',
			color: 'green',
			lifetime: 2000,
			size: 0.8,
			density: 5
		},
		{
			font: '2',
			lifetime: 2000,
			density: 5
		},
		{
			font: '1',
			lifetime: 2000,
			density: 5
		},
		{
			font: oImg4,
			lifetime: 2000,
			density: 5,
			color: "red"
		},
		{
			font: 'I ❤ YOU',
			lifetime: 2000,
			color: 'red',
			density: 3
		}
	];
	const container = document.getElementById('canvasContainer');
	new ParticleSystem({
		fontDataList: fontList,
		loop: true,
		width: 200,
		height: 200,
		size: 0.8,
		container
	});
})();