console.log("ニコニコ最前面コメント開始-2");
inner=document.body.innerHTML;
inner=inner.replace(/\r|\n|\t/g,"");
if(inner.match(/\$\('#nicoplayerContainerInner'\)\.flash/)){
	disableIsBackComment2();
}
function disableIsBackComment2(){//ginza
	// WatchApp.namespace.model.player.NicoPlayerConnector.playerAreaConnector.addEventListener("onVideoInitialized",function(e){console.log("event e=%o",e);});
	// WatchApp.namespace.model.player.NicoPlayerConnector.playerInitializeModel.flashVars.videoDetail
	/*
	#watchAPIDataContainerは
	channelInfo: Object
	flashvars: Object
	playlistToken: ""
	tagRelatedMarquee: null
	videoDetail: Object
	viewerInfo: Object
	を持ってる
	*/
	var add;
	add=function(){
		console.log("ニコニコ最前面コメント:disableIsBackComment2");
		//ここからneo
		//onVideoChangeStatusUpdatedの時にjssを更新する
//		var jss={},checkedId="";
//		var checkLog=function(str){
//			setTimeout(update,1);
//			return;
//			var keys={};
//			var jss=JSON.parse($('#watchAPIDataContainer').text());
//			keys.vid=jss.flashvars.v;
//			keys.ページを開いた時刻=new Date(jss.flashvars.wv_time*1000)+"";
//			keys.ページを開いた時刻からの差分=(new Date()-new Date(jss.flashvars.wv_time*1000))/1000;
//			keys.vidのback=(jss.flashvars.isBackComment?"yes":"no");
//			keys.WatchAppのback=(WatchApp.namespace.model.player.NicoPlayerConnector.playerInitializeModel.flashVars.isBackComment?"yes":"no");
//			console.log("%c "+str,"color:black; background:#FFA;");
//			console.log(JSON.stringify(keys));
//			console.log(JSON.stringify(WatchApp.namespace.model.player.NicoPlayerConnector.playerInitializeModel.flashVars));
//		};
		var init=function(){
			var a=WatchApp.namespace.model.player.NicoPlayerConnector.playerInitializeModel.flashVars;
			if(a.isBackComment===null){return;}
			a.isBackComment=null;
			a.pageHasFocus=true;
			//PlayerApp.ns.player.Nicoplayer.getInstance().externalChangeVideo( a)
			WatchApp.namespace.model.player.NicoPlayerConnector.externalChangeVideo(a);
		};
		var readyInit=function(){
			if(!WatchApp || !WatchApp.namespace || !WatchApp.namespace.init || !WatchApp.namespace.init.PlayerInitializer || !WatchApp.namespace.init.PlayerInitializer.playerAreaConnector){
				setTimeout(readyInit,10);
			}else{
				WatchApp.namespace.init.PlayerInitializer.playerAreaConnector.addEventListener("jumpVideo",function(e){debugger;checkLog("jumpVideo");});
				WatchApp.namespace.init.PlayerInitializer.playerAreaConnector.addEventListener("onVideoChangeStatusUpdated",function(e){debugger;checkLog("onVideoChangeStatusUpdated");});
				WatchApp.namespace.init.PlayerInitializer.playerAreaConnector.addEventListener("onVideoStarted",function(e){debugger;checkLog("onVideoStarted");});
				init();
			}
		};
		readyInit();
	}
	var elem=document.createElement('script');
	elem.setAttribute("type","text/javascript");
	elem.innerHTML="setTimeout("+add.toString()+",1);";
	document.body.appendChild(elem);
}


