/*
 * @Author: ttj
 * @Github: https://github.com/tomatoKnightJ
 * @Description: 匹配图片的相似度
 * @Date: 2019-02-28 16:07:38
 */
const fs = require('fs');
const path = require('path');
const { createImageData, loadImage, createCanvas } = require('canvas');
const basePath = process.argv[2] || './images/';
const imgFolder = path.resolve(__dirname, basePath);
console.log('basePath',basePath);
console.log('imgFolder',imgFolder);
const imgList = fs.readdirSync(imgFolder);
// 过滤非图片文件
const filterImgList = imgList.filter((item) => {
  const reg=/(.*)\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$/; 
  return reg.test(item);
});
const canvas = createCanvas(200, 200);
const ctx = canvas.getContext('2d');

async function shrinkingImg (imgList=[]) {
  const list = (imgList.map( async item => {
    const oImg = await loadImage(imgFolder+'/'+item);
    const imgWidth = 8;
    ctx.clearRect(0,0,imgWidth,imgWidth);
    ctx.drawImage(oImg, 0, 0, imgWidth, imgWidth);
    const data = ctx.getImageData(0,0,imgWidth,imgWidth);
    return data.data;
  }));
  console.log('list',list);
  
  return list;
}

async function getHashList (imgList) {
  const list = await shrinkingImg(imgList);
  const averageList = [];
  list.forEach(item => {
    const itemList = [];
    item.forEach((newItem, index) => {
      if ((index+1)%4 === 0) {
        const newItem1 = item[index-3];
        const newItem2 = item[index-2];
        const newItem3 = item[index-1];
        const gray = (newItem1 + newItem2 + newItem3)/3;
        itemList.push(~~gray);
      }
    }); 
    const hashData = getHash(itemList);
    averageList.push(hashData);
  });
  return averageList;
}

function getHash (arr) {
  const length = arr.length;
  const average = arr.reduce((pre, next) => pre+next, 0)/length;
  return arr.map(item => item >= average ? 1 : 0).join('');
}

// 编辑距离算法
function strSimilarity2Number(s, t){
	let n = s.length, m = t.length, d=[];
	let i, j, s_i, t_j, cost;
	if (n == 0) return m;
	if (m == 0) return n;
	for (i = 0; i <= n; i++) {
		d[i]=[];
		d[i][0] = i;
	}
	for(j = 0; j <= m; j++) {
		d[0][j] = j;
	}
	for (i = 1; i <= n; i++) {
		s_i = s.charAt (i - 1);
		for (j = 1; j <= m; j++) {
			t_j = t.charAt (j - 1);
			if (s_i == t_j) {
				cost = 0;
			}else{
				cost = 1;
			}
		d[i][j] = Minimum (d[i-1][j]+1, d[i][j-1]+1, d[i-1][j-1] + cost);
		}
	}
	return d[n][m];
}
function Minimum(a,b,c){
	return a<b?(a<c?a:c):(b<c?b:c);
}
//两个字符串的相似程度，并返回相似度百分比
function strSimilarity2Percent(s, t){
	let l = s.length > t.length ? s.length : t.length;
	let d = strSimilarity2Number(s, t);
	return (1-d/l).toFixed(4);
}
/**
 * @description: 相似度判断
 * @param {imgList:Array[文件列表数组], limit:Number[相似度系数]}
 * @return: 相似度二维数组
 */
async function getSimilarImgList (imgList=[], limit=0.85) {  
  //异常处理
  if (!imgList.length) return [];
  // 获取图片索引二维数组
  const arr = await getHashList(imgList);
  const array = [];
  // 已经匹配的图片无需再做遍历
  const includeList = [];
  for (let index = 0,length = arr.length; index < length; index++) {
    const element = arr[index];
    const list = [];
    for (let i = index+1; i < length; i++) {
      const elementNext = arr[i];
      const percent = strSimilarity2Percent(element, elementNext);
      const includeItem = includeList.indexOf(i) > 0;
      if (percent>limit && !includeItem) {
        list.push(i);
        includeList.push(i);
      }
    }
    if (list.length) array.push([index,...list]);
  }
  const mappingArr = array.map(item=>{
    return item.map(index => imgList[index]);
  });
  return mappingArr;
}

getSimilarImgList(filterImgList, 0.99);