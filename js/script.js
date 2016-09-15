var chessBoard = [];
var color = true;
var over = false;

//赢法数组
var wins = [];

//赢法统计数组
var myWin = [];
var computerWin = [];


for(var i = 0;i<15;i++){//初始化二维数组 用来存放落子点
	chessBoard[i] = [];
	for(var j = 0;j<15;j++){
		chessBoard[i][j] = 0;//0代表这个点没有落子
	}
}

for(var i=0;i<15;i++){//初始化三维赢法数组
	wins[i] = [];
	for(var j=0;j<15;j++){
		wins[i][j] = [];
	}
}

var count = 0;//赢法种类索引初始化

for(var i=0;i<15;i++){//所有横向赢法
	for(var j=0;j<11;j++){
		for(var k=0;k<5;k++){
			wins[i][j+k][count] = true;
		}
		count++;
	}
}
 
//wins[0][0][0] = true;
//wins[0][1][0] = true;
//wins[0][2][0] = true;
//wins[0][3][0] = true;
//wins[0][4][0] = true;

//wins[0][1][1] = true;
//wins[0][2][1] = true;
//wins[0][3][1] = true;
//wins[0][4][1] = true;
//wins[0][5][1] = true;
//......

//wins[0][10][10] = true;
//wins[0][11][10] = true;
//wins[0][12][10] = true;
//wins[0][13][10] = true;
//wins[0][14][10] = true;

for(var i=0;i<15;i++){//所有竖线赢法
	for(var j=0;j<11;j++){
		for(var k=0;k<5;k++){
			wins[j+k][i][count] = true;
		}
		count++;
	}
}
 
for(var i=0;i<11;i++){//所有斜线赢法
	for(var j=0;j<11;j++){
		for(var k=0;k<5;k++){
			wins[i+k][j+k][count] = true;
		}
		count++;
	}
}

for(var i=0;i<11;i++){//所有反斜线赢法
	for(var j=14;j>3;j--){
		for(var k=0;k<5;k++){
			wins[i+k][j-k][count] = true;
		}
		count++;
	}
}

//console.log(count);//输出为572，表示共有572种赢法


for(var i=0;i<count;i++){//赢法统计数组初始化
	myWin[i] = 0;
	computerWin[i] = 0;
}

var chess = document.getElementById('chess');
var context = chess.getContext('2d');
/*
	getContext() 方法返回一个用于在画布上绘图的环境。
	Canvas.getContext(contextID);

	参数 contextID 指定了想要在画布上绘制的类型。
	当前唯一的合法值是 "2d"，它指定了二维绘图，并且导致这个方法返回一个环境对象，该对象导出一个二维绘图 API。
	在未来，如果 <canvas> 标签扩展到支持 3D 绘图，getContext() 方法可能允许传递一个 "3d" 字符串参数。

	描述
	返回一个表示用来绘制的环境类型的环境。
	其本意是要为不同的绘制类型（2 维、3 维）提供不同的环境。
	当前，唯一支持的是 "2d"，它返回一个 CanvasRenderingContext2D 对象，该对象实现了一个画布所使用的大多数方法。

*/

context.strokeStyle = "#BFBFBF";

drawChessBoard();

function drawChessBoard(){

	for(var i=0;i<15;i++){
		//横线
		context.moveTo(15+i*30,15);

		context.lineTo(15+i*30,435);

		context.stroke();

		//纵线
		context.moveTo(15,15+i*30);

		context.lineTo(435,15+i*30);

		context.stroke();

	} 
}

function oneStep(i,j,color){

	context.beginPath();//路径绘制开始
	context.arc(15+i*30,15+j*30,13,0,2*Math.PI);//扇形绘制函数，用来画圆
	context.closePath();
/*
	黑色棋子渐变的实现，createRadialGradient()方法用来制造两个圆，六个参数分别是每个圆的圆心坐标和半径
	addColorStop()用来设置两个圆的颜色 ，第一个参数这是一个范围在 0.0 到 1.0 之间的浮点值，表示渐变的开始点和结束点之间的一部分。为 0 对应开始点， 为 1 对应结束点。
	在两个圆之间的位置进行渐变填充
*/
	var gradient = context.createRadialGradient(15+i*30,15+j*30,13,15+i*30+2,15+j*30-2,0);
	if(color){//color 为true表示黑色 false表示白色
		gradient.addColorStop(0,"#0A0A0A");
		gradient.addColorStop(1,"#636766");
	}else {
		gradient.addColorStop(0,"#D1D1D1");
		gradient.addColorStop(1,"#F9F9F9");
	}	
	
	context.fillStyle = gradient;
	context.fill();//这个fill和画棋盘用的stroke的不同点是：stroke是用来画线/描边的，fill是用来填充的

}

chess.onclick = function(event){
	if(over){
		return;
	}
	if(!color){
		return;
	}

	var x = event.offsetX;
	var y = event.offsetY;
	var i = Math.floor(x/30);
	var j = Math.floor(y/30);

	if(chessBoard[i][j] == 0){//此点无落子，才允许落子
		oneStep(i,j,color);
		chessBoard[i][j] = 1;//1表示此点为黑棋落子

		for(var k=0;k<count;k++){
			if(wins[i][j][k]){//如果我方在第k种赢法的第[i][j]位置上有一颗棋子
				myWin[k]++;//我方赢法统计加1
				computerWin[k] = 6;
				//若是出现我方棋子,则不可能出现计算机方棋子,将计算机方赢法统计数组随便设置为一个异常值6，因为赢法最多是五连子，赢法统计不可能大于五
				if(myWin[k] == 5){
					alert("你赢了");
					over = true;
				}
			}
		}
		if(!over){
			color = !color;//改变颜色，轮流落子
			computerAI();
		}
	}
	
}

function computerAI(){
	var myScore = [];//我方积分
	var computerScore = [];//电脑积分

	var max = 0;
	var u = 0;
	var v = 0;

	for(var i=0;i<15;i++){
		myScore[i] = [];
		computerScore[i] = [];
		for(var j=0;j<15;j++){
			myScore[i][j] = 0;
			computerScore[i][j] = 0;
		}
	}
	for(var i=0;i<15;i++){//遍历整个棋盘
		for(var j=0;j<15;j++){
			if(chessBoard[i][j]==0){//判断棋盘点是否为空闲点
				for(var k=0;k<count;k++){
					if(wins[i][j][k]){
						if(myWin[k]==1){
							myScore[i][j] += 200;
						}else if(myWin[k] == 2){
							myScore[i][j] += 400;
						}else if(myWin[k]==3){
							myScore[i][j] += 2000;
						}else if(myWin[k]==4){
							myScore[i][j] += 10000;
						}

						if(computerWin[k]==1){
							computerScore[i][j] += 220;
						}else if(myWin[k] == 2){
							computerScore[i][j] += 420;
						}else if(myWin[k]==3){
							computerScore[i][j] += 2100;
						}else if(myWin[k]==4){
							computerScore[i][j] += 20000;
						}
					}
				}
				if(myScore[i][j] > max){
					max = myScore[i][j];
					u = i;
					v = j;
				}else if(myScore[i][j] == max){
					if(computerScore[i][j] > computerScore[u][v]){
						u = i;
						v = j;
					}
				}

				if(computerScore[i][j] > max){
					max = computerScore[i][j];
					u = i;
					v = j;
				}else if(computerScore[i][j] == max){
					if(myScore[i][j] > myScore[u][v]){
						u = i;
						v = j;
					}
				}
			}
		}

	}
	oneStep(u,v,false);
	chessBoard[u][v] = 2;

	//翻转上面的我方赢法，改为计算机赢法
	for(var k=0;k<count;k++){
			if(wins[u][v][k]){//如果计算机方在第k种赢法的第[i][j]位置上有一颗棋子
				computerWin[k]++;//计算机方赢法统计加1
				myWin[k] = 6;
				//若是出现计算机方棋子,则不可能出现我方棋子,将我方赢法统计数组随便设置为一个异常值6，因为赢法最多是五连子，赢法统计不可能大于五
				if(computerWin[k] == 5){
					alert("计算机赢了");
					over = true;
				}
			}
		}
		if(!over){
			color = !color;//改变颜色，轮流落子
		}
}

/*

AI算法：
	赢法数组：记录所有的赢法，三维数组
	每一种赢法的统计数组，一维数组

*/