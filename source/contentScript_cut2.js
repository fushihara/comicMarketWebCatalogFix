page_cut2=(function(){
	var domGenre,domDescriptionMessage,domDescriptionUrlSite,domDescriptionUrlNico,domDescriptionUrlPixiv,domDescriptionUrlTwitter;
	var domMemoTextArea,domMemoButton;
	var token;
	var currentId;
	this.init=function(){
		//サークル右クリックで出てくるウィンドウに要素を追加する
		//備考欄を追加
		var dt,dd,styleUrl="font-family:monospace;word-break:break-all;";
		dt=document.createElement("dt");
		dt.innerHTML='備考等:<span id="genre'+common.randKey+'"></span>';
		dd=document.createElement("dd");
		dd.innerHTML='<div id="message'+common.randKey+'" style="height:150px;background-color:#E4E4E4;">message</div>'+
					'<div>HP:<span style="'+styleUrl+'" id="hp'+common.randKey+'">読込中http://</span></div>'+
					'<div>ニコ:<span style="'+styleUrl+'" id="nico'+common.randKey+'">読込中</span></div>'+
					'<div>Pixiv:<span style="'+styleUrl+'" id="pixiv'+common.randKey+'">読込中</span></div>'+
					'<div>Twitter:<span style="'+styleUrl+'" id="twitter'+common.randKey+'">読込中</span></div>';
		document.querySelectorAll(".webcatalog-pseudo-dialog-content .modal-circle-panel dt").forEach(function( node, index, nodeList){
			if(-1<node.innerText.indexOf("告知画像")){
				node.parentNode.insertBefore(dt,node);
				node.parentNode.insertBefore(dd,node);
			}
		});
		domGenre=document.getElementById("genre"+common.randKey);
		domDescriptionMessage=document.getElementById("message"+common.randKey);
		domDescriptionUrlSite=document.getElementById("hp"+common.randKey);
		domDescriptionUrlNico=document.getElementById("nico"+common.randKey);
		domDescriptionUrlPixiv=document.getElementById("pixiv"+common.randKey);
		domDescriptionUrlTwitter=document.getElementById("twitter"+common.randKey);
		//メモ帳のテキストを仕込んでおく
		domMemoTextArea=document.createElement("textarea");
		domMemoButton  =document.createElement("button");
		domMemoTextArea.style.width="100%";
		domMemoTextArea.style.height="100px";
		domMemoTextArea.disabled=true;
		domMemoTextArea.addEventListener("keyup",function(e){e.stopPropagation();},true);
		domMemoButton.style.width="100%";
		domMemoButton.setAttribute("class"," c-btn c-btn--action");
		domMemoButton.innerText="メモ 更新(手動)";
		document.querySelector(".webcatalog-pseudo-dialog-content .modal-circle-panel").appendChild(domMemoTextArea);
		document.querySelector(".webcatalog-pseudo-dialog-content .modal-circle-panel").appendChild(domMemoButton);

		//cssを弄くる
		jQuery(".md-modal .modal-info dd").css("margin-top","2px");
		jQuery(".md-modal .modal-info dt").css("margin-top","2px");
		jQuery(".md-modal .modal-body"   ).css("margin-top","5px");
		jQuery(".md-modal"               ).css("padding"   ,"10px");
		//トークンを取得する
		token=eval("("+document.head.innerHTML.match(/ComiketWebCatalog.+({[\s\S]*?})/)[1]+")").value;
	};
	this.loading=function(){
		domGenre.innerHTML="";
		domDescriptionMessage.innerHTML="loading...";
		domDescriptionUrlSite.innerHTML="loading...";
		domDescriptionUrlNico.innerHTML="loading...";
		domDescriptionUrlPixiv.innerHTML="loading...";
		domDescriptionUrlTwitter.innerHTML="loading...";
		domMemoTextArea.disabled=true;
		domMemoTextArea.value="loading..";
		domMemoButton.setAttribute("class"," c-btn c-btn--disaled");
		domMemoButton.innerText="読込中...";
	};
	this.failed=function(errorMessage){
		domGenre.innerHTML="";
		domDescriptionMessage.innerHTML="failed<br>"+errorMessage;
		domDescriptionUrlSite.innerHTML="xxx";
		domDescriptionUrlNico.innerHTML="xxx";
		domDescriptionUrlPixiv.innerHTML="xxx";
		domDescriptionUrlTwitter.innerHTML="xxx";
		domMemoTextArea.disabled=true;
		domMemoTextArea.value="failed";
		domMemoButton.setAttribute("class"," c-btn c-btn--disaled");
		domMemoButton.innerText="failed";
	};
	var getUrlHtml=function(url){
		if(!!url){
			return "<a href=\""+url+"\">"+url+"</a>";
		}else{
			return "none";
		}
	};
	this.onLoadAjax=function(json){
		domGenre.innerText=json.Genre;
		domDescriptionMessage.innerText=json.Description;
		domDescriptionUrlSite.innerHTML=getUrlHtml(json.WebSite);
		domDescriptionUrlNico.innerHTML=getUrlHtml(json.NiconicoUrl);
		domDescriptionUrlPixiv.innerHTML=getUrlHtml(json.PixivUrl);
		domDescriptionUrlTwitter.innerHTML=getUrlHtml(json.TwitterUrl);
		domMemoTextArea.disabled=false;
		domMemoTextArea.value=!json.Favorite?"":json.Favorite.Memo;
		domMemoButton.setAttribute("class"," c-btn c-btn--action");
		domMemoButton.innerText="メモ 更新(手動)";
		domMemoButton.addEventListener("click",memoClick);
		currentId=json.Id;
	};
	var memoClick=function(){
		var color=document.querySelector("#modal-favorite-box").getAttribute("class").match(/backgroundcolor-(\d+)/)[1]-0;
		if(color==0){
			alert("メモはお気に入り登録をしないと使えません。\n橙 紫 黄 等のラジオボタンをどれか選択して下さい");
			return;
		}
		domMemoButton.removeEventListener("click",memoClick);
		domMemoButton.setAttribute("class"," c-btn c-btn--disaled");
		domMemoButton.innerText="メモ 保存中";
		domMemoTextArea.disabled=true;
		common.saveFavorite(token,currentId,color,domMemoTextArea.value,memoClickCallback);
	};
	var memoClickCallback=function(isSuccess,data){
		domMemoTextArea.disabled=false;
		if(!isSuccess){
			domMemoButton.setAttribute("class"," c-btn c-btn--disaled");
			domMemoButton.innerText="保存失敗 ページをリロードして下さい";
		}else{
			domMemoButton.setAttribute("class"," c-btn c-btn--action");
			domMemoButton.innerText="メモ 更新(手動)";
			domMemoButton.addEventListener("click",memoClick);
		}
	}
	return this;
})();
page_cut2.init();


//サークル右クリックで出てくる公式のウィンドウを隠して自作ウィンドウで使うDOMを仕込む
//document.querySelector(".webcatalog-pseudo-dialog .md-modal").style.display="none";
//baseDom=document.createElement("div");
//baseDom.innerText="h9oge";
//document.querySelector(".webcatalog-pseudo-dialog-content").appendChild(baseDom);
//common.windowDomSet(baseDom);

//サークル右クリックで出てくるウインドウの内容が更新された時にイベントを仕込む
mo_loadStart = new MutationObserver(function(changeNodeData,instance){
	if(changeNodeData[changeNodeData.length-1].target.style.display=="none"){
		onLoadStart();
	}else if(changeNodeData[changeNodeData.length-1].target.style.height=="1px"){
		onLoadComplete();
	}
});
mo_loadStart.observe( document.querySelector(".webcatalog-pseudo-dialog .modal-body") ,{attributes: true, attributeFilter: ["style"],attributeOldValue: true });


//イベントは読み込みを開始、読み込みが完了 の二段階
function onLoadStart(){
	page_cut2.loading();
}
function onLoadComplete(){
	var linkDom=document.querySelector(".webcatalog-pseudo-dialog .js-btn-detail");
	var linkText=linkDom.getAttribute("href");
	var circleId=linkText.match(/Circle\/(\d+)/)[1];
	common.loadCircle( circleId ,onAjaxLoadComplete);
}
function onAjaxLoadComplete(isSuccess,data){
	if(!isSuccess){
		page_cut2.failed(data.textStatus);
	}else{
		page_cut2.onLoadAjax(data.data);
	}
}