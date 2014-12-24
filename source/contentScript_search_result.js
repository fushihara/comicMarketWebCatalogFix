function oneItem(circleId_,circleCutTdElement_,circleStringTdElement_,appendAreaTdElement_,token_){
	var id=circleId_;
	var token=token_;
	var circleCutTdElement=circleCutTdElement_
	var circleStringTdElement=circleStringTdElement_;
	var appendAreaTdElement=appendAreaTdElement_;
	var domMemoTextArea,domMemoButton;
	var domDescriptionUrlSite,domDescriptionUrlNico,domDescriptionUrlPixiv,domDescriptionUrlTwitter;
	//読み込みボタンを追加
	//備考欄を追加
	var domLoadButton;
	var favoriteRadioNodes=[];
	var init=function(){
		domLoadButton=document.createElement("button");
		domLoadButton.innerHTML='詳細開く';
		circleStringTdElement.appendChild(domLoadButton);
		domLoadButton.addEventListener("click",onClickButton);
	};
	var onClickButton=function(){
		//各種URLのノード、メモ欄、保存ボタン、ラジオボタンを用意する
		domLoadButton.removeEventListener("click",onClickButton);
		domLoadButton.disabled=true;
		var tempHr=document.createElement("hr");
		appendAreaTdElement.appendChild(tempHr);
		//各種URLのエリアを追加
		var styleUrl="font-family:monospace;word-break:break-all;background-color:#F4F4F4;";
		var tempDiv=document.createElement("div");
		var privateKey=common.randKey+"-"+id
		tempDiv.innerHTML='HP:<span style="'+styleUrl+'" id="hp'+privateKey+'">読込中</span>'+
		'ニコ:<span style="'+styleUrl+'" id="nico'+privateKey+'">読込中</span><br>'+
		'Pixiv:<span style="'+styleUrl+'" id="pixiv'+privateKey+'">読込中</span>'+
		'Twitter:<span style="'+styleUrl+'" id="twitter'+privateKey+'">読込中</span>';
		appendAreaTdElement.appendChild(tempDiv);
		domDescriptionUrlSite=tempDiv.querySelector("#hp"+privateKey);
		domDescriptionUrlNico=tempDiv.querySelector("#nico"+privateKey);
		domDescriptionUrlPixiv=tempDiv.querySelector("#pixiv"+privateKey);
		domDescriptionUrlTwitter=tempDiv.querySelector("#twitter"+privateKey);
		//お気に入りtextAreaを追加
		domMemoTextArea =document.createElement("textarea");
		domMemoTextArea.style.width="100%";
		domMemoTextArea.style.height="100px";
		domMemoTextArea.disabled=true;
		domMemoTextArea.value="読込中";
		appendAreaTdElement.appendChild(domMemoTextArea);
		//お気に入りのラジオボタンを追加。連想配列だと順番が保証されないので・・・
		var favoriteColors=[ "#FF944A", "#FF00FF", "#FFF700", "#00B54A", "#00B5FF", "#9C529C", "#0000FF", "#00FF00", "#FF0000"];
		favoriteColors.forEach(function(val,index,list){
			var labelNode=document.createElement("label");
			labelNode.style.backgroundColor=val;
			var radioNode=document.createElement("input");
			radioNode.setAttribute("type","radio");
			radioNode.setAttribute("name","fav-color-"+id);
			radioNode.setAttribute("value",index+1);
			radioNode.disabled=true;
			var spanNode=document.createElement("span");
			spanNode.innerText="　";
			labelNode.appendChild(radioNode);
			labelNode.appendChild(spanNode);
			appendAreaTdElement.appendChild(labelNode);
			favoriteRadioNodes[favoriteRadioNodes.length]=radioNode;
		});
		//お気に入り登録のボタンを追加
		domMemoButton=document.createElement("button");
		domMemoButton.innerText="読込中...";
		domMemoButton.disabled=true;
		appendAreaTdElement.appendChild(domMemoButton);
		common.loadCircle( id ,onLoadAjaxComplete);
	};
	var getUrlHtml=function(url){
		if(!!url){
			return "<a href=\""+url+"\">"+url+"</a>";
		}else{
			return "none";
		}
	};
	//最初にボタンを押してapiから現在のステータスを読み込んだ時のapi
	var onLoadAjaxComplete=function(isSuccess,data){
		if(!isSuccess){
			domMemoTextArea.value="読込失敗 再度読み込みして下さい";
			domLoadButton.disabled=false;
			domLoadButton.innerHTML='再読み込み';
			//TODO 連打対策真面目にやる
			domLoadButton.addEventListener("click",function(){
				domLoadButton.disabled=true;
				domMemoTextArea.value="読込中...";
				common.loadCircle( id ,onLoadAjaxComplete);
			});
		}else{
			var json=data.data;
			domDescriptionUrlSite.innerHTML=getUrlHtml(json.WebSite);
			domDescriptionUrlNico.innerHTML=getUrlHtml(json.NiconicoUrl);
			domDescriptionUrlPixiv.innerHTML=getUrlHtml(json.PixivUrl);
			domDescriptionUrlTwitter.innerHTML=getUrlHtml(json.TwitterUrl);
			domMemoTextArea.disabled=false;
			domMemoTextArea.value=!json.Favorite?"":json.Favorite.Memo;
			favoriteRadioNodes.forEach(function(value,index,nodes){
				value.disabled=false;
				value.addEventListener("click",saveStart);
				if(json.Favorite==null){
					return;
				}
				if(index+1==json.Favorite.Color){
					value.checked=true;
				}
			});
			domMemoButton.disabled=false;
			domMemoButton.innerText="メモ 保存/←色変更時は自動保存";
			domMemoButton.addEventListener("click",saveStart);
		}
	};
	var saveStart=function(){
		//保存ボタンを押した、or色変更を押した
		//ラジオボタンが選択されているか確認する
		var favoriteIndex=0;
		favoriteRadioNodes.forEach(function(value,index,nodes){
			if(value.checked){
				favoriteIndex=index+1;
			}
		});
		if(favoriteIndex==0){
			alert("メモはお気に入り登録をしないと使えません。\n橙 紫 黄 等のラジオボタンをどれか選択して下さい");
			return false;
		}
		//サークルカットの背景を更新する。通信に失敗したらサーバー側とズレるけど画面とズレるよりマシ
		circleCutTdElement.setAttribute("class","favorite-backgroundcolor-"+favoriteIndex);
		//各種を無効化する
		domMemoButton.disabled=true;
		domMemoButton.removeEventListener("click",saveStart);
		domMemoTextArea.disabled=true;
		favoriteRadioNodes.forEach(function(value,index,nodes){
			value.disabled=true;
			value.removeEventListener("click",saveStart);
		});
		domMemoButton.innerText="保存中..";
		common.saveFavorite(token,id,favoriteIndex,domMemoTextArea.value,memoClickCallback);
		return false;
	};
	var memoClickCallback=function(isSuccess,data){
		domMemoButton.disabled=false;
		domMemoTextArea.disabled=false;
		domMemoButton.addEventListener("click",saveStart);
		favoriteRadioNodes.forEach(function(value,index,nodes){
			value.disabled=false;
			value.addEventListener("click",saveStart);
		});
		if(!isSuccess){
			domMemoButton.innerText="保存失敗 再読み込みして下さい";
		}else{
			domMemoButton.innerText="メモ 保存/←色変更時は自動保存";
		}
	};
	init();
}
page_search_result=(function(){
	var oneItems={};
	//トークンを取得する
	var token=eval("("+document.head.innerHTML.match(/ComiketWebCatalog.+({[\s\S]*?})/)[1]+")").value;
	this.init=function(){
		var nodesTemp=[];
		document.querySelectorAll(".c-table--list td").forEach(function(node,i,nodeList){
			  if(node.attributes.getNamedItem("colspan")!=null && node.attributes.getNamedItem("colspan").value==3){return;}
			  nodesTemp[nodesTemp.length]=node;
		});
		for(var i=0;i<nodesTemp.length;i=i+4){
			var cid=nodesTemp[i].querySelector("a").getAttribute("href").match(/Circle\/(\d+)/)[1]-0;
			oneItems[cid]=new oneItem(cid,nodesTemp[i],nodesTemp[i+1],nodesTemp[i+3],token);
		}
	};
	return this;
})();
page_search_result.init();

