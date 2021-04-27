let C={};
//获取相对坐标点
C.getxy=function(ele){
	let mouse={x:0,y:0};
	ele.addEventListener('mousemove',function(e){
		let ev=e || window.event;
		let {x,y} = C.wrapevent(ev);
		mouse.x=x;
		mouse.y=y;
	});
	return mouse;
}

//坐标系转换
C.wrapevent=function(ev){
	let {pageX, pageY, target} = ev;
  	let {left, top} = target.getBoundingClientRect();
  	return {x: pageX - left, y: pageY - top};
}
// 取随机数
C.random = function(a,b){
	return Math.min(a,b)+Math.random()*Math.abs(b-a);
}
// 随机颜色
C.creatColor=function(){
	return '#'+(~~(Math.random()*(1<<24))).toString(16);
}
// 矩形碰撞检测
C.rectBounceing = function(self,aim){
	return (self.x+self.w>=aim.x && self.x<=aim.x+aim.w && self.y<=aim.y+aim.h && self.y+self.h>=aim.y);
}
//圆边界反弹
C.rebound = function(ball,w,h,bounce){
	if(ball.x+ball.r>w){
		ball.x = w - ball.r;
		ball.vx *= -bounce;
	}
	if(ball.x<ball.r){
		ball.x=ball.r;
		ball.vx*=-bounce;
	}
	if(ball.y+ball.r>h){
		ball.y = h - ball.r;
		ball.vy *= -bounce;
	}
	if(ball.y<ball.r){
		ball.y=ball.r;
		ball.vy*=-bounce;
	}
}
//两点的距离
C.dist = function(ball1,ball2){
	return Math.sqrt((ball1.x-ball2.x)**2+(ball1.y-ball2.y)**2)
}
C.rp = function(start,end){
	let e = Math.max(start,end);
	let s = Math.min(start,end);
	let dist = e - s;
	return Math.random()*dist + s;
}
// 圆与直线的交点
C.intersection = function(cx,cy,r,stx,sty,edx,edy) {
    var k = (edy - sty) / (edx - stx);
    var b = edy - k*edx;
    var x1,y1,x2,y2;
    var c = cx*cx + (b - cy)*(b- cy) -r*r;
    var a = (1 + k*k);
    var b1 = (2*cx - 2*k*(b - cy));
    var  tmp = Math.sqrt(b1*b1-4*a*c);
    if(isNaN(tmp)){
    	return false
    }
    x1 = ( b1 + tmp )/(2*a);
    y1 = k*x1 + b;
    x2 = ( b1 - tmp)/(2*a);
    y2 = k*x2 + b;
    var res = (x1 -cx)*(x1 -cx) + (y1 - cy)*(y1 -cy);
    var  p = {};
    if( res == r*r)
    {
        p.x = x1;
        p.y = y1;
    }    else
    {
        p.x = x2;
        p.y = y2;
    }
	return p;
}
//圆与圆的碰撞反弹
C.circleBounceing = function(b1,b2){
    let dx = b2.x - b1.x;
    let dy = b2.y - b1.y;
    let dist = Math.sqrt(dy**2+dx**2);
   
    if(dist<b1.r+b2.r){
        let angle = Math.atan2(dy,dx);
        let sin = Math.sin(angle),cos = Math.cos(angle);
        //将小球1作为中心点
        //旋转坐标
        let x1=0;
        let y1=0;
        let x2 = dx * cos + dy * sin;
        let y2 = dy * cos - dx * sin;

        // 旋转两球的速度
        let vx1 = b1.vx * cos + b1.vy * sin;
        let vy1 = b1.vy * cos - b1.vx * sin;
        let vx2 = b2.vx * cos + b2.vy * sin;
        let vy2 = b2.vy * cos - b2.vx * sin;
        // 处理两球水平位置的碰撞
        let vx1Final = ((b1.m - b2.m) * vx1 + 2 * b2.m * vx2) / (b1.m + b2.m);
        let vx2Final = ((b2.m - b1.m) * vx2 + 2 * b1.m * vx1) / (b1.m + b2.m);

        let lep = (b1.r + b2.r) - Math.abs(x2 - x1);

        x1 = x1 + (vx1Final < 0 ? -lep/2 : lep/2);
        x2 = x2 + (vx2Final < 0 ? -lep/2 : lep/2);
        //将坐标转回 
        b2.x = b1.x + (x2 * cos - y2 * sin);
        b2.y = b1.y + (y2 * cos + x2 * sin);
        b1.x = b1.x + (x1 * cos - y1 * sin);
        b1.y = b1.y + (y1 * cos + x1 * sin);
        //将速度转回
        b1.vx = vx1Final * cos - vy1 * sin;
        b1.vy = vy1 * cos + vx1Final * sin;
        b2.vx = vx2Final * cos - vy2 * sin;
        b2.vy = vy2 * cos + vx2Final * sin;
    };
}