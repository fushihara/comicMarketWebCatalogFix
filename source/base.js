NodeList.prototype.forEach = function (fun, thisp) {
  return Array.prototype.forEach.call(this, fun, thisp);
};
chromeExtensionW2n.DOMContentLoaded=function(){
	var init=function(){
		if(false){
		}else if(document.location.pathname.indexOf("/Search/Result")==0){
			initSearchResult();
		}else if(document.location.pathname.indexOf("/User/FavoritesCosplayer")==0){
		}else if(document.location.pathname.indexOf("/User/FavoritesBooth")==0){
		}else if(document.location.pathname.indexOf("/User/Favorites")==0){
			initUserFavorite();
		}else if(document.location.pathname.indexOf("/Circle/List")==0){
			initCircleList()
		}else if(document.location.pathname.indexOf("/CircleRapid/Cut2")==0){
			initCircleRapidCut2();
		}else if(document.location.pathname.indexOf("/Map/Hall")==0){
			initMapHall();
		}else if(document.location.pathname.indexOf("/Circle")==0){
			initCircle();
		}
	};
	var initCircle=function(){ // https://webcatalog.circle.ms/Circle/11904240
		token=document.head.innerHTML.replace(/\r|\n| |　|\t/g,"").match(/ComiketWebCatalog.AntiForgeryToken={.+?value:'(.+?)'}/)[1];
		var d=document.createElement("div");
		d.style.width="180px";
		var h=document.querySelector("div.m-media__image");
		var i=h.querySelector("div.m-colorbox")
		var nodeNew=new chromeExtensionW2n.customElements.base1();
		var circleId=document.location.pathname.match(/\/(\d+)/)[1];
		nodeNew.setSettingColorsFitWide(true);
		nodeNew.setSettingLinkAreaShown(false);
		nodeNew.setSettingDesriptionShown(false);
		nodeNew.setOnUpdateRequest(function( favoriteNum , memo , callback ){
			//更新ボタンをクリックした時
			var callback2=function(){
				//通信が終わった時。favoriteNumに合わせてサムネの背景色を変える
				var tagetDiv=document.querySelector("div.l-main div.circlecut-overlay-favorite");
				setFavoriteBackgroundColor(tagetDiv,favoriteNum);
				callback();
			};
			if(favoriteNum==0){
				//0でもaddFavorite出来るけど怪しいのでパス
				apiRemoveFavorite(circleId , callback2 );
			}else{
				apiAddFavorite(circleId , favoriteNum , memo , callback2 );
			}
		});
		h.insertBefore(d,i);
		d.appendChild(nodeNew);
		i.parentNode.removeChild(i);
		apiDetail(circleId,function(jsonOrNull){
			nodeNew.setApiResult(jsonOrNull);
		});
	};
	var initSearchResult=function(){
		token=document.head.innerHTML.replace(/\r|\n| |　|\t/g,"").match(/ComiketWebCatalog.AntiForgeryToken={.+?value:'(.+?)'}/)[1];
		var circle=function(trNode1,trNode2,initialFavorite){
			this.imageCut= trNode1.querySelector("a>img").getAttribute("src");
			this.id    = trNode1.querySelector("a.h-text--large").getAttribute("href").replace("/Circle/","");
			this.name  = "";
			this.info = "";
			var sp=trNode1.querySelectorAll("span");
			for(var i=0;i<sp.length;i++){
				this.info+=sp[i].innerText+" ";
			}
			var ps=trNode2.querySelectorAll("p");
			var hasTag=false;
			for(var i=0;i<ps.length;i++){
				var inText=ps[i].innerText;
				if(hasTag){
					this.info+="<br>";
				}
				this.info+=inText;
				if(inText.indexOf("タグ: ")==0){hasTag=true;}
			}
			this.name=trNode1.querySelector("a.h-text--large").innerText;
			this.initialFavorite=getFavoriteBackgroundColor(trNode1.querySelector("td"));
		};
		var circles=[];
		var p=document.querySelectorAll(".m-result table.c-table--list tr");
		for(var i=0;i<p.length-2;i++){ // "/Circle/11934438"
			if( (p[i] instanceof HTMLElement) && p[i].classList.contains("c-table__sep")){
				circles.push(new circle(p[i+1],p[i+2]));
				i+=2;
			}
		}
		//ここから新テーブル作成
		var table=document.createElement("table");
		table.classList.add("c-table--list");
		table.classList.add("h-mt--20");
		var tr=document.createElement("tr");
		tr.innerHTML="<th class=\"h-wd--100\">カット</th><th>説明文</th>";
		table.appendChild(tr);
		for(var i=0;i< circles.length;i++){
			var tr=document.createElement("tr");
			tr.innerHTML="<td><a href=\"/Circle/"+circles[i].id+"\"><img src=\""+circles[i].imageCut+"\" class=\"search-result-image\"></a><br><button style=\"width:100%;\">show</button></td><td style=\"vertical-align: top;\"><a href=\"/Circle/"+circles[i].id+"\" class=\"h-text--large\">"+circles[i].name+"</a><br>"+circles[i].info.replace(/\n/g,"<br>")+"<div class=\"elementArea\"></div></td>";
			var onClick=initSearchResultOnClickEvent(circles[i],tr);
			tr.querySelector("button").addEventListener("click",onClick);
			//初期状態のお気に入りをセットする
			setFavoriteBackgroundColor(tr.querySelector("td"),circles[i].initialFavorite);
			table.appendChild(tr);
		}
		var remove=document.querySelector("div.m-result table.c-table--list");
		remove.parentNode.removeChild(remove);
		document.querySelector("div.m-result").insertBefore(table,document.querySelector("div.m-result").children[2]);
	};
	var initSearchResultOnClickEvent=function(circuleData,trNode){
		var onClick=(function(circuleData,trNode){
			return function(e){
				e.preventDefault();
				var newTemp=new chromeExtensionW2n.customElements.base1();
				trNode.querySelector(".elementArea").appendChild(newTemp);
				trNode.querySelector("button").disabled=true;
				newTemp.setSettingColorsFitWide(false);
				newTemp.setSettingLinkAreaShown(true);
				newTemp.setSettingDesriptionShown(false);
				newTemp.initializeAndSetFavorite(circuleData.initialFavorite);
				newTemp.setOnUpdateRequest(function(favoriteNumber,memo , callback){
					var callback2=function(data){
						//trのクラスを一旦消して、付け直す
						setFavoriteBackgroundColor(trNode.querySelector("td"),favoriteNumber);
						callback(data);
					};
					if(favoriteNumber==0){
						//0でもaddFavorite出来るけど怪しいのでパス
						apiRemoveFavorite(circuleData.id , callback2 );
					}else{
						apiAddFavorite(circuleData.id , favoriteNumber , memo , callback2 );
					}
				});
				apiDetail(circuleData.id,function(jsonOrNull){newTemp.setApiResult(jsonOrNull);});
				return false;
			};
		})(circuleData,trNode);
		return onClick;
	};
	var initUserFavorite=function(){ // https://webcatalog.circle.ms/User/Favorites
		token=document.head.innerHTML.replace(/\r|\n| |　|\t/g,"").match(/ComiketWebCatalog.AntiForgeryToken={.+?value:'(.+?)'}/)[1];
		var baseTable=document.querySelector("table.md-infotable");
		var baseTrs=baseTable.querySelectorAll("tr");
		var oneRecordSet=function(tr1,tr2,tr3){
			var xElementInsertType=1;
			var xElementInsertNode1,xElementInsertNode2,xElementInertArea;
			var circleId;
			var defaultMemo;
			var defaultFavoriteNumber;
			var openButton;
			var xElement;
			var init=function(){
				circleId=tr1.getAttribute("id");
				//既存のお気に入りフォームを潰す
				tr3.querySelector("td.infotable-left2").innerHTML="";
				//メモのテキストを取得する
				defaultMemo=tr2.querySelector("span[id^='webcatalog-favorite-dialog-memo-']").innerHTML;
				tr2.parentNode.removeChild(tr2);
				//お気に入り状態のデフォルトを取得する
				defaultFavoriteNumber=getFavoriteColor(tr1.querySelector("td"));
				//ボタンを作り直す
				tr1.querySelector("p.md-btn").innerHTML="";
				openButton=document.createElement("button");
				openButton.innerHTML="開く";
				openButton.addEventListener("click",openButtonOnClick);
				tr1.querySelector("p.md-btn").appendChild( openButton );
			};
			var openButtonOnClick=function(){
				openButton.disabled=true;
				var xElement=new chromeExtensionW2n.customElements.base1();
				xElementInertArea.innerHTML="";
				xElementInertArea.appendChild( xElement );
				xElement.setSettingColorsFitWide(false);
				xElement.setSettingLinkAreaShown(true);
				xElement.setSettingDesriptionShown(true);
				xElement.initializeAndSetFavorite(defaultFavoriteNumber);
				xElement.setOnUpdateRequest(function(favoriteNumber,memo , callback){
					var callback2=function(data){
						//trのクラスを一旦消して、付け直す
						setFavoriteColor(tr1.querySelector("td"),favoriteNumber);
						callback(data);
					};
					if(favoriteNumber==0){
						//0でもaddFavorite出来るけど怪しいのでパス
						apiRemoveFavorite(circleId , callback2 );
					}else{
						apiAddFavorite(circleId , favoriteNumber , memo , callback2 );
					}
				});
				apiDetail(circleId,function(jsonOrNull){xElement.setApiResult(jsonOrNull);});
			};
			this.setXelementInsertArguments=function(parentNode,insertBefore){
				xElementInsertType=1;
				xElementInsertNode1=parentNode;
				xElementInsertNode2=insertBefore;
			};
			this.setXelementAppendChildArguments=function(parentNode){
				xElementInsertType=2;
				xElementInsertNode1=parentNode;
			};
			this.initxElement=function(){
				xElementInertArea=document.createElement("tr");
				xElementInertArea.innerHTML="<td colspan=\"3\" style=\"text-align:left;border-left: 1px solid #C8C8C8;\">"+defaultMemo+"</td>";
				if( xElementInsertType==1 ){
					xElementInsertNode1.insertBefore(xElementInertArea,xElementInsertNode2);
				}else if( xElementInsertType==2 ){
					xElementInsertNode1.appendChild(xElementInertArea);
				}
				xElementInertArea=xElementInertArea.querySelector("td");
			};
			init();
		};
		records=[];
		for(var i=0;i < baseTrs.length; i++){
			var nowTd=baseTrs[i];
			if(!nowTd.classList.contains("webcatalog-circle-list-detail")){
				continue;
			}
			var add=new oneRecordSet( baseTrs[i] , baseTrs[i+1] , baseTrs[i+2] );
			if( i+3 <= baseTrs.length ){
				add.setXelementInsertArguments(baseTrs[i].parentNode,baseTrs[i+3]);
			}else{
				add.setXelementAppendChildArguments(baseTrs[i].parentNode);
			}
			records.push(add);
			i+=2;
		}
		for(var i=0; i < records.length; i++){
			records[i].initxElement();
		}
	};
	// https://webcatalog.circle.ms/Circle/List?day=Day1
	var initCircleList=function(){
		token=document.head.innerHTML.replace(/\r|\n| |　|\t/g,"").match(/ComiketWebCatalog.AntiForgeryToken={.+?value:'(.+?)'}/)[1];
		var baseTable=document.querySelector("table.md-infotable");
		var baseTrs=baseTable.querySelectorAll("tr");
		var oneRecordSet=function(tr1,tr2,tr3){
			var xElementInsertType=1;
			var xElementInsertNode1,xElementInsertNode2,xElementInertArea;
			var circleId;
			var defaultFavoriteNumber;
			var openButton;
			var xElement;
			var init=function(){
				circleId=tr1.getAttribute("id");
				//既存のお気に入りフォームを潰す
				tr3.querySelector("div.webcatalog-favorite-dialog-color").innerHTML="";
				//お気に入り状態のデフォルトを取得する
				defaultFavoriteNumber=getFavoriteBackgroundColor(tr1.querySelector("div.circlecut-overlay-favorite"));
				//ボタンを作り直す
				openButton=document.createElement("button");
				openButton.innerHTML="開く";
				openButton.setAttribute("class","c-btn c-btn--action");
				openButton.addEventListener("click",openButtonOnClick);
				tr3.querySelector("p.md-btn").innerHTML="";
				tr3.querySelector("p.md-btn").appendChild( openButton );
			};
			var openButtonOnClick=function(){
				openButton.disabled=true;
				openButton.setAttribute("class","c-btn");
				var xElement=new chromeExtensionW2n.customElements.base1();
				xElementInertArea.innerHTML="";
				xElementInertArea.parentNode.style.display="table-row";
				xElementInertArea.appendChild( xElement );
				xElement.setSettingColorsFitWide(false);
				xElement.setSettingLinkAreaShown(false);
				xElement.setSettingDesriptionShown(false);
				xElement.initializeAndSetFavorite(defaultFavoriteNumber);
				xElement.setOnUpdateRequest(function(favoriteNumber,memo , callback){
					var callback2=function(data){
						//trのクラスを一旦消して、付け直す
						setFavoriteBackgroundColor(tr1.querySelector("td div.circlecut-overlay-favorite"),favoriteNumber);
						callback(data);
					};
					if(favoriteNumber==0){
						//0でもaddFavorite出来るけど怪しいのでパス
						apiRemoveFavorite(circleId , callback2 );
					}else{
						apiAddFavorite(circleId , favoriteNumber , memo , callback2 );
					}
				});
				apiDetail(circleId,function(jsonOrNull){xElement.setApiResult(jsonOrNull);});
			};
			this.setXelementInsertArguments=function(parentNode,insertBefore){
				xElementInsertType=1;
				xElementInsertNode1=parentNode;
				xElementInsertNode2=insertBefore;
			};
			this.setXelementAppendChildArguments=function(parentNode){
				xElementInsertType=2;
				xElementInsertNode1=parentNode;
			};
			this.initxElement=function(){
				xElementInertArea=document.createElement("tr");
				xElementInertArea.innerHTML="<td colspan=\"5\" style=\"text-align:left;border-left: 1px solid #C8C8C8;\"></td>";
				xElementInertArea.style.display="none";
				if( xElementInsertType==1 ){
					xElementInsertNode1.insertBefore(xElementInertArea,xElementInsertNode2);
				}else if( xElementInsertType==2 ){
					xElementInsertNode1.appendChild(xElementInertArea);
				}
				xElementInertArea=xElementInertArea.querySelector("td");
			};
			init();
		};
		records=[];
		for(var i=0;i < baseTrs.length; i++){
			var nowTd=baseTrs[i];
			if(!nowTd.classList.contains("webcatalog-circle-list-detail")){
				continue;
			}
			var add=new oneRecordSet( baseTrs[i] , baseTrs[i+1] , baseTrs[i+2] );
			if( i+3 <= baseTrs.length ){
				add.setXelementInsertArguments(baseTrs[i].parentNode,baseTrs[i+3]);
			}else{
				add.setXelementAppendChildArguments(baseTrs[i].parentNode);
			}
			records.push(add);
			i+=2;
		}
		for(var i=0; i < records.length; i++){
			records[i].initxElement();
		}
	};
	var initCircleRapidCut2=function(){ // https://webcatalog.circle.ms/CircleRapid/Cut2
		token=document.head.innerHTML.replace(/\r|\n| |　|\t/g,"").match(/ComiketWebCatalog.AntiForgeryToken={.+?value:'(.+?)'}/)[1];
		var onContextMenu=function(circleLink){
			var circleId=circleLink.match(/\/Circle\/(\d+)/)[1];
			return function(e){
				var initialFavorite= getFavoriteBackgroundColor(e.target.parentNode.querySelector("div.circlecut-overlay-favorite"));
				var xElement=new chromeExtensionW2n.customElements.base1();
				xElementInsertBase.innerHTML="";
				xElementInsertBase.parentNode.style.display="table-row";
				xElementInsertBase.appendChild( xElement );
				xElement.setSettingColorsFitWide(true);
				xElement.setSettingLinkAreaShown(false);
				xElement.setSettingDesriptionShown(true);
				xElement.initializeAndSetFavorite(initialFavorite);
				xElement.setOnUpdateRequest(function(favoriteNumber,memo , callback){
					var callback2=function(data){
						//trのクラスを一旦消して、付け直す。サークル一覧の画像と、ポップアップの画像と２つ
						setFavoriteBackgroundColor(e.target.parentNode.querySelector("div.circlecut-overlay-favorite"),favoriteNumber);
						setFavoriteBackgroundColor(document.querySelector("#modal-favorite-box"),favoriteNumber);
						callback(data);
					};
					if(favoriteNumber==0){
						//0でもaddFavorite出来るけど怪しいのでパス
						apiRemoveFavorite(circleId , callback2 );
					}else{
						apiAddFavorite(circleId , favoriteNumber , memo , callback2 );
					}
				});
				apiDetail(circleId,function(jsonOrNull){xElement.setApiResult(jsonOrNull);});
			};
		};
		var nodes=document.querySelectorAll("a.circle-cut");
		for(var i=0;i<nodes.length;i++){
			nodes[i].addEventListener("contextmenu",onContextMenu(nodes[i].getAttribute("href")));
		}
		var xElementInsertBase=document.createElement("div");
		document.querySelector("div.webcatalog-pseudo-dialog dd.webcatalog-favorite-dialog-color").innerHTML="";
		document.querySelector("div.webcatalog-pseudo-dialog div.modal-cut a.js-btn-add").outerHTML="";
		document.querySelector("div.webcatalog-pseudo-dialog dd.webcatalog-favorite-dialog-color").appendChild(xElementInsertBase);
	};
	var initMapHall=function(){ // https://webcatalog.circle.ms/Map/Hall?day=Day1&genreCode=301&hall=e123
		//イベントが取れないからサークル詳細へボタンのリンクが変わった時に読み込む
		token=document.head.innerHTML.replace(/\r|\n| |　|\t/g,"").match(/ComiketWebCatalog.AntiForgeryToken={.+?value:'(.+?)'}/)[1];
		var onCircleButtonChange=function(data){
			var clickNode=data[0].target;
			var circleId=clickNode.getAttribute(data[0].attributeName).match(/\/Circle\/(\d+)/)[1];
			var xElement=new chromeExtensionW2n.customElements.base1();
			xElementInsertBase.innerHTML="";
			xElementInsertBase.parentNode.style.display="table-row";
			xElementInsertBase.appendChild( xElement );
			xElement.setSettingColorsFitWide(true);
			xElement.setSettingLinkAreaShown(false);
			xElement.setSettingDesriptionShown(true);
			xElement.initializeAndSetFavorite(0);//お気に入り不明
			xElement.setOnUpdateRequest(function(favoriteNumber,memo , callback){
				var callback2=function(data){
					//trのクラスを一旦消して、付け直す。サークル一覧の画像と、ポップアップの画像と２つ
					setFavoriteBackgroundColor(document.querySelector("#modal-favorite-box"),favoriteNumber);
					callback(data);
				};
				if(favoriteNumber==0){
					//0でもaddFavorite出来るけど怪しいのでパス
					apiRemoveFavorite(circleId , callback2 );
				}else{
					apiAddFavorite(circleId , favoriteNumber , memo , callback2 );
				}
			});
			apiDetail(circleId,function(jsonOrNull){xElement.setApiResult(jsonOrNull);});
		};
		var mo = new MutationObserver(onCircleButtonChange);
		mo.observe(document.querySelector("div.webcatalog-pseudo-dialog-content div.modal-cut ul.md-btn a.js-btn-detail"),{attributes:true,attributeFilter:["href"],attributeOldValue:true});
		var xElementInsertBase=document.createElement("div");
		document.querySelector("div.webcatalog-pseudo-dialog dd.webcatalog-favorite-dialog-color").innerHTML="";
		document.querySelector("div.webcatalog-pseudo-dialog div.modal-cut a.js-btn-add").outerHTML="";
		document.querySelector("div.webcatalog-pseudo-dialog dd.webcatalog-favorite-dialog-color").appendChild(xElementInsertBase);
	};
	//favorite-backgroundcolor-ノードの色をセットしたりゲットしたりする
	this.getFavoriteBackgroundColor=function(node){
		for(var i=0;i<=9;i++){
			if(node.classList.contains("favorite-backgroundcolor-"+i)){
				return i;
			}
		}
		return 0;
	};
	this.setFavoriteBackgroundColor=function(node,number){
		for(var i=0;i<=9;i++){
			node.classList.remove("favorite-backgroundcolor-"+i);
		}
		if(number==0){
			return;
		}
		node.classList.add("favorite-backgroundcolor-"+number);
	};
	//favorite-color-ノードの色をセットしたりゲットしたりする
	this.getFavoriteColor=function(node){
		for(var i=0;i<=9;i++){
			if(node.classList.contains("favorite-color-"+i)){
				return i;
			}
		}
		return 0;
	};
	this.setFavoriteColor=function(node,number){
		for(var i=0;i<=9;i++){
			node.classList.remove("favorite-color-"+i);
		}
		if(number==0){
			return;
		}
		node.classList.add("favorite-color-"+number);
	};
	//詳細、登録、削除apiをコールする
	this.apiDetail=function(circleId,callbackJsonOrNull){
		$.ajax({
			cache:false,
			dataType:"json",
			error:function(jqXHR,textStatus,errorThrown){
				callbackJsonOrNull(null);
			},
			success:function(data,textStatus,jqXHR){
				callbackJsonOrNull(data);
			},
			type:"POST",
			url:"/Circle/"+circleId+"/DetailJsonWithFavorite"
		});
	};
	this.apiAddFavorite=function(circleId,favoriteNumber,memo,callback){
		$.ajax({
			cache:false,
			dataType:"json",
			error:function(jqXHR,textStatus,errorThrown){
				callback(null);
			},
			success:function(data,textStatus,jqXHR){
				callback(data);
			},
			type:"POST",
			url:"/User/UpdateFavorite",
			data:{
				"__RequestVerificationToken":token,
				"id":circleId,
				"color":favoriteNumber,
				"memo":memo
			}
		});
	};
	this.apiRemoveFavorite=function(circleId,callback){
		$.ajax({
			cache:false,
			dataType:"json",
			error:function(jqXHR,textStatus,errorThrown){
				callback(null);
			},
			success:function(data,textStatus,jqXHR){
				callback(data);
			},
			type:"POST",
			url:"/User/RemoveFavorite",
			data:{
				"__RequestVerificationToken":token,
				"id":circleId,
			}
		});
	}
	this.token="";
	init();
};
window.addEventListener("DOMContentLoaded",chromeExtensionW2n.DOMContentLoaded);
