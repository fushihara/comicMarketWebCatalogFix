// http://superbrothers.hatenablog.com/entry/20110615/1308149592
// node, index, nodeList
NodeList.prototype.forEach = function (fun, thisp) {
	return Array.prototype.forEach.call(this, fun, thisp);
};
//サークル右クリックで出てくる公式のウィンドウを隠して自作ウィンドウで使うDOMを仕込む
var common=(function(){
	var jqXHRLoad={};
	this.randKey="ex_"+Math.round( Math.random()*1000000000);
	this.jsonAbort=function(){
		for(i in jqXHRLoad){
			i.abort();
		}
	};
	this.getToken=function(){
		var token=document.head.innerHTML.replace(/\r|\n| |　|\t/g,"").match(/ComiketWebCatalog.AntiForgeryToken={.+?value:'(.+?)'}/)[1];
		return token;
	};
	this.loadCircle=function(circleId,callback){
		jqXHRLoad[circleId]=$.ajax({
			cache:false,
			dataType:"json",
			error:function(jqXHR,textStatus,errorThrown){
				callback(false,{jqXHR:jqXHR,textStatus:textStatus,errorThrown:errorThrown})
			},
			success:function(data,textStatus,jqXHR){
				callback(true,{data:data,textStatus:textStatus,jqXHR:jqXHR})
			},
			type:"POST",
			url:"/Circle/"+circleId+"/DetailJsonWithFavorite"
		});
	};
	this.saveFavorite=function(token,id,color,memo,callback){
		jqXHRLoad[id]=$.ajax({
			cache:false,
			dataType:"json",
			error:function(jqXHR,textStatus,errorThrown){
				callback(false,{jqXHR:jqXHR,textStatus:textStatus,errorThrown:errorThrown})
			},
			success:function(data,textStatus,jqXHR){
				callback(true,{data:data,textStatus:textStatus,jqXHR:jqXHR})
			},
			type:"POST",
			url:"/User/UpdateFavorite",
			data:{
				"__RequestVerificationToken":token,
				"id":id,
				"color":color,
				"memo":memo
			}
		});
	};
	this.removeFavorite=function(token,id,callback){
		jqXHRLoad[id]=$.ajax({
			cache:false,
			dataType:"json",
			error:function(jqXHR,textStatus,errorThrown){
				callback(false,{jqXHR:jqXHR,textStatus:textStatus,errorThrown:errorThrown})
			},
			success:function(data,textStatus,jqXHR){
				callback(true,{data:data,textStatus:textStatus,jqXHR:jqXHR})
			},
			type:"POST",
			url:"/User/RemoveFavorite",
			data:{
				"__RequestVerificationToken":token,
				"id":id
			}
		});
	};
	this.labelColors=["#FF944A","#FF00FF","#FFF700","#00B54A","#00B5FF","#9C529C","#0000FF","#00FF00","#FF0000"];
	return this;
})();
