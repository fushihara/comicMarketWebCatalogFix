chromeExtensionW2n.customElements.base1=(function(){
	var globalId="W2n";
	var templeteId="base1";
	var templeteTagId="#"+globalId+"_"+templeteId;
	var proto=Object.create(HTMLElement.prototype, {
		createdCallback: {
			value: function() {
				var tempNode = document.querySelector(templeteTagId).import;
				var t = tempNode.querySelector("template");
				var clone = document.importNode(t.content, true);
				var shadowRoot=this.createShadowRoot();
				var instance=this;
				shadowRoot.appendChild(clone);
				this.doc=shadowRoot;
				var settingColorsFitWide=true;//色選択部分の横幅を切りつけて使うかどうか
				var settingLinkAreaShown=true;//各種リンク部分を表示するかどうか
				var settingDescriptionShown=true;//説明文の部分を表示するかどうか
				var foreachColors=function(callback){
					for(var i=0;i<=9;i++){
						var node=shadowRoot.querySelector((settingColorsFitWide?"#colors1":"#colors2")+" input[type='radio'][name='color'][id='"+i+"']");
						callback(node,i);
					}
				};
				var setFavoriteNumber=function(favoriteInt){
					foreachColors(function(node,favoriteNumber){
						if(favoriteNumber==favoriteInt){
							node.checked=true;
						}else{
							node.checked=false;
						}
					});
				};
				var setLinkStatus=function(nodeId,link){
					var nodeOn =shadowRoot.querySelector("#url"+nodeId+"On");
					var nodeOnA=nodeOn.querySelector("a");
					var nodeOff=shadowRoot.querySelector("#url"+nodeId+"Off");
					if(link!=""){
						nodeOn .style.display="";
						nodeOnA.setAttribute("href",link);
						nodeOff.style.display="none";
					}else{
						nodeOn .style.display="none";
						nodeOff.style.display="";
					}
				};
				var getMemoNode=function(){
					return shadowRoot.querySelector("#memo");
				};
				var getUpdateButton=function(){
					return shadowRoot.querySelector((settingColorsFitWide?"#colors1":"#colors2")+" .button");
				};
				var getDescriptionNode=function(){
					return shadowRoot.querySelector("#description");
				};
				var onMemoNodeKeydown=function(e){
					if( e.code == "KeyS" && e.ctrlKey == true ){
						e.preventDefault();
						e.stopPropagation();
						instance.onStatusChangeEvent();
						return false;
					}
				};
				this.setSettingColorsFitWide=function(flag){
					//最初に現在の選択されている値をチェックして、新しい値で反映させる
					var doupdate=false;
					var updateFavoriteNumber=0;
					if(settingColorsFitWide!=flag){
						doupdate=true;
						foreachColors(function(node,favoriteNumber){
							if(node.checked){
								updateFavoriteNumber=favoriteNumber;
							}
						});
					}
					settingColorsFitWide=flag;
					this.updateSettingForm();
					if(doupdate){
						foreachColors(function(node,favoriteNumber){
							if(favoriteNumber==updateFavoriteNumber){
								node.checked=true;
							}else{
								node.checked=false;
							}
						});
					}
				};
				this.setSettingLinkAreaShown=function(flag){
					settingLinkAreaShown=flag;
					this.updateSettingForm();
				};
				this.setSettingDesriptionShown=function(flag){
					settingDescriptionShown=flag;
					this.updateSettingForm();
				};
				this.updateSettingForm=function(){
					if(settingColorsFitWide){
						shadowRoot.querySelector("#colors1").style.display="block";
						shadowRoot.querySelector("#colors2").style.display="none";
					}else{
						shadowRoot.querySelector("#colors1").style.display="none";
						shadowRoot.querySelector("#colors2").style.display="block";
					}
					if(settingLinkAreaShown){
						shadowRoot.querySelector("#urls").style.display="block";
					}else{
						shadowRoot.querySelector("#urls").style.display="none";
					}
					if(settingDescriptionShown){
						shadowRoot.querySelector("#description").style.display="block";
					}else{
						shadowRoot.querySelector("#description").style.display="none";
					}
				};
				this.callbackUpdateRequest=function(){};
				this.initializeAndSetFavorite=function(favoriteInt){
					//お気に入りの番号をセットする、お気に入りのチェックボックスを無効化する、リンクを全て無効化する、メモのテキストを消す、メモのテキストを無効化する
					foreachColors(function(node,favoriteNumber){
						if(favoriteNumber==favoriteInt){
							node.checked=true;
						}else{
							node.checked=false;
						}
						node.disabled=true;
					});
					setLinkStatus("Hp","");
					setLinkStatus("Pixiv","");
					setLinkStatus("Twitter","");
					setLinkStatus("Nico","");
					getMemoNode().disabled=true;
					getMemoNode().value="";
					getMemoNode().addEventListener("keydown",onMemoNodeKeydown);
					getUpdateButton().disabled=true;
				};
				this.setApiResult=function(objectOrNull){
					console.log("setApiResult=%o",objectOrNull);
					if(objectOrNull==null){
						getMemoNode().value="エラー";
						return;
					}
					//お気に入りのチェックボックス、メモ、ボタンを更新
					if(objectOrNull.Favorite!=null){
						getMemoNode().disabled=false;
						getMemoNode().value=objectOrNull.Favorite.Memo;
						foreachColors(function(node,favoriteNumber){
							if(favoriteNumber==objectOrNull.Favorite.Color){
								node.checked=true;
							}else{
								node.checked=false;
							}
							node.disabled=false;
						});
					}else{
						getMemoNode().disabled=false;
						getMemoNode().value="";
						foreachColors(function(node,favoriteNumber){
							if(favoriteNumber==0){
								node.checked=true;
							}else{
								node.checked=false;
							}
							node.disabled=false;
						});
					}
					getUpdateButton().disabled=false;
					getDescriptionNode().innerText=objectOrNull.Description;
					//リンク情報を更新
					setLinkStatus("Hp",objectOrNull.WebSite);
					setLinkStatus("Pixiv",objectOrNull.PixivUrl);
					setLinkStatus("Twitter",objectOrNull.TwitterUrl);
					setLinkStatus("Nico",objectOrNull.NiconicoUrl);
				};
				this.setOnUpdateRequest=function(callbackUpdateReq){
					callbackUpdateRequest=callbackUpdateReq;
				};
				this.onStatusChangeEvent=function(){
					var favoriteNum=0;
					foreachColors(function(node,favoriteNumber){
						if(node.checked){
							favoriteNum=favoriteNumber;
						}
						node.disabled=true;
					});
					var memo=getMemoNode().value;
					var callback=function(){
						foreachColors(function(node,favoriteNumber){
							node.disabled=false;
						});
						getMemoNode().disabled=false;
						getUpdateButton().disabled=false;
					};
					getMemoNode().disabled=true;
					getUpdateButton().disabled=true;
					callbackUpdateRequest(favoriteNum,memo,callback);
				};
			}
		},
		attachedCallback : {
			value: function(){
				this.shadowRoot.querySelector("#colors1 .button").addEventListener("click",this.onStatusChangeEvent);
				this.shadowRoot.querySelector("#colors2 .button").addEventListener("click",this.onStatusChangeEvent);
				this.updateSettingForm();
			}
		},
		attributeChangedCallback : {
			value: function(attrName, oldVal, newVal){
			}
		},
		detachedCallback : {
			value: function(){
			}
		},
	});
	return document.registerElement('x-'+globalId+'-'+templeteId,{prototype:proto});
})();
