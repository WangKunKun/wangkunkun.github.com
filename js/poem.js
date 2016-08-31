
 function insertPoem(){

		// alert("aaa");
		// conlog("asdad")

	var arr = ["乌衣巷,朱雀桥边野草花,乌衣巷口夕阳斜,旧时王谢前堂燕,飞入寻常百姓家"]

	let index = Math.floor(Math.random()*arr.length)

	let poemStr = arr[index]

	let poemArr = poem.split(",")

	var poemContent = ""

	//添加标题
	poemContent += "<WKTitle>" + poemArr[0] + "</WKTitle>"
	poemContent += "<p>-</p>"
	//删除标题
	delete poemArr[0]

	for i in poemArr
	{
			poemContent += "<p>" + i + "</p>"

	}


	let insertLabel = document.getElementById("poem")
	insertLabel.innerHTML += poemContent
}
// window.onload = insertPoem();
