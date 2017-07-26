Array.prototype.indexOf = function(item){
	for(var i =0;i<this.length;i++){
		if(this[i] == item){
			return i;
		}
	}

	return -1;
}

var Site = {
	Create:function(x,y){
		var me = document.createElement('div');
		document.body.appendChild(me); 
		me.style.position = 'absolute';
		me.style.left = 23*x + 'px';
		me.style.top = 23*y + 'px';
		me.style.height = '23px';
		me.style.width =  '23px';
		var i = (x%9 == 0)? x/9:1;
		var j = (y%9 == 0)? y/9:1;
		var s = i + 3*j ;
		// me._backStyle = "B" + ((s==4&&(i/3)%2==1&&(j/3)%2==1) ? "X" : s);
		me._backStyle = "B" + s;
		me.x = x;
		me.y = y;
		me.Fill = this.Fill;
		me.Fill(); //初始化填充
		me.onclick = this.Play; //绑定onclick事件到Play方法。
		return me;
	},
	Fill:function(dot,going){//dot根据棋子状态填充背景
		if(dot == undefined){
			this.className = this._backStyle;
		}else{
			this.className = (going?'C':'D')+dot;
		}
		this.dot = dot;//保存棋子状态
	},
	Play:function(){
		if(this.dot == undefined){//无子
			var step = Tracks[Tracks.length-1];
			console.log(step)
            if(step) step.site.Fill(step.site.dot);
			this.Fill(current, true); //填入当前该填的子
			var deads = [];
			Tracks.push( new Step(this, deads) );
			current ^= 1;       //用1来异或，正好反转黑白棋子。
		}

	}
}

var Board = new Array(19); //记录棋盘

var Tracks = []; //行棋线索 数组元素是step对象  step对象中  记录棋步的位置  记录被当前棋步杀死的棋子

var current=0;  //围棋先行 0表黑子  1表白子

var rob = null; //记录打劫

for(var x=0;x<19;x++){
	Board[x] = new Array(19);
	for(var y=0;y<19;y++){
		Board[x][y] = Site.Create(x,y);
	}
}


function Step(site, deads)   //棋步类，记录每一步棋的状态
{
    this.site = site;   //记录棋步的位置
    this.deads = deads; //记录被当前棋步杀死的棋子集合
};

document.body.oncontextmenu = function()     //悔棋事件
{
	var step = Tracks.pop(); //当前棋子
    if (step)
    {
        step.site.Fill(); //将背景变为初始化状态  所以悔棋不是真正的悔棋，而是改变其状态就好了
        for (var i=0; i<step.deads.length; i++)  //这里也是一样，将吃掉的棋子状态又改变回来
            step.deads[i].Fill(current);

        step = Tracks[Tracks.length-1]; //上一步棋子
        if (step) step.site.Fill(current, true)
        current ^= 1;       //反转黑白棋子。
    };
    return false;   //不弹出菜单。
};
