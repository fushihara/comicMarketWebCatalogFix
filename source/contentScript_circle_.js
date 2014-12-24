//textAreaを追加
id=document.querySelector(".webcatalog-circle-list-detail").getAttribute("data-webcatalog-circle-id");
token=eval("("+document.head.innerHTML.match(/ComiketWebCatalog.+({[\s\S]*?})/)[1]+")").value;
var domRadioButtons=[];
var domButtonEdit,domButtonRemove,domTextArea;
//お気に入りのラベルのチェックボックスを追加
divs=document.createElement("div");
divs.style.width="170px";
divs.style.overflow="hidden";
common.labelColors.forEach(function(val,index,list){
	var labelNode=document.createElement("label");
	labelNode.style.backgroundColor=val;
	labelNode.style.float="left";
	var radioNode=document.createElement("input");
	radioNode.setAttribute("type","radio");
	radioNode.setAttribute("value",index);
	radioNode.setAttribute("name","favorite-color");
	radioNode.disabled=true;
	var spanNode=document.createElement("span");
	spanNode.innerText="　";
	labelNode.appendChild(radioNode);
	labelNode.appendChild(spanNode);
	var event=(function(favoriteNo){
		return function(){
			clickSave();
			//alert("click:"+favoriteNo);
		}
	})(index+1);
	radioNode.addEventListener("click",event);
	domRadioButtons.push(radioNode);
	divs.appendChild(labelNode);
});
document.querySelector(".m-media__image").insertBefore(divs,document.querySelector(".m-media__image>a.js-circlecut-link"));
//お気に入り登録ボタン、削除ボタンを作成
divs=document.createElement("div");
divs.style.width="170px";
divs.style.overflow="hidden";
domButtonEdit=document.createElement("button");
domButtonEdit.innerText="保存";
domButtonEdit.setAttribute("class","c-btn");
domButtonEdit.style.width="80px";
domButtonEdit.disabled=true;
domButtonEdit.addEventListener("click",clickSave);
domButtonRemove=document.createElement("button");
domButtonRemove.innerText="削除";
domButtonRemove.setAttribute("class","c-btn");
domButtonRemove.style.width="80px";
domButtonRemove.disabled=true;
domButtonRemove.addEventListener("click",clickRemove);
divs.appendChild(domButtonEdit);
divs.appendChild(domButtonRemove);
document.querySelector(".m-media__image").insertBefore(divs,document.querySelector(".m-media__image>a.js-circlecut-link"));
//テキストエリアを作成
domTextArea=document.createElement("textarea");
domTextArea.style.display="block";
domTextArea.style.height="100px";
domTextArea.disabled=true;
document.querySelector(".m-media__image").insertBefore(domTextArea,document.querySelector(".m-media__image>a.js-circlecut-link"));
//元々のエリアを削除
document.querySelector(".m-colorbox").style.display="none";
//読み込み開始
common.loadCircle(id,function(result,data){
	if(!result){
		domTextArea.value="読み込み失敗";
		return;
	}
	if(data.data.Favorite){
		domTextArea.value=data.data.Favorite.Memo;
		domRadioButtons[data.data.Favorite.Color-1].checked=true;
	}
	domEnableChange(true);
	console.log(data);
});
function domEnableChange(mode){//各種DOMの有効無効を切り替える。加えて、ボタンについてはclassを追加削除し外見も変える
	domRadioButtons.forEach(function(val,index,list){
		val.disabled=!mode;
	});
	domButtonEdit.disabled=!mode;
	domButtonRemove.disabled=!mode;
	domTextArea.disabled=!mode;
	
	if(mode==true){
		domButtonEdit.classList.add("c-btn--action");
		domButtonRemove.classList.add("c-btn--action");
	}else{
		domButtonEdit.classList.remove("c-btn--action");
		domButtonRemove.classList.remove("c-btn--action");
	}
}
function updateFavoriteColor(colorNoFrom0){//サークルカット左上のお気に入りの色を変更する
	var dom=document.querySelector("div.circlecut-overlay-favorite");
	for(var i=0;i<10;i++){
		dom.classList.remove("favorite-backgroundcolor-"+i);
	}
	if(colorNoFrom0!=-1){//このクラス名は1～9
		var className="favorite-backgroundcolor-"+((colorNoFrom0-0)+1);
		dom.classList.add(className);
	}
}
function clickRemove(){
	domEnableChange(false);
	common.removeFavorite(token,id,function(){
		domTextArea.value="";
		domRadioButtons.forEach(function(v){v.checked=false;});
		updateFavoriteColor(-1);
		domEnableChange(true);
	});
}

function clickSave(){
	var favoriteIndex=$("input[name=favorite-color]:checked").val();
	if(favoriteIndex==null){
		alert("メモはお気に入り登録をしないと使えません。\n橙 紫 黄 等のラジオボタンをどれか選択して下さい");
		return;
	}
	domEnableChange(false);
	updateFavoriteColor(favoriteIndex);
	common.saveFavorite(token,id,favoriteIndex-0+1,domTextArea.value,function(isSuccess,data){
		domEnableChange(true);
		if(isSuccess==false){
			alert("保存に失敗しました。ページの再読み込みをして下さい");
			return;
		}
	});
}
