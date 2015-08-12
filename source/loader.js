globalId="W2n";
function injectScriptSource(source) {
    var s = document.createElement('script');
    s.innerHTML=source;
    document.documentElement.appendChild(s);
}
function injectScript(file) {
    var s = document.createElement('script');
    s.setAttribute('src', chrome.extension.getURL(file));
    document.documentElement.appendChild(s);
}
function injectImport(file,id){
    var s = document.createElement('link');
    s.setAttribute('rel', 'import');
    s.setAttribute('href', chrome.extension.getURL(file));
    s.setAttribute('id',globalId+"_"+id);
    document.documentElement.appendChild(s);
}
function injectTemp(id){
  injectScript( '/templates/'+id+'.js');
  injectImport( '/templates/'+id+'.html',id);
}
injectScriptSource("chromeExtension"+globalId+"={customElements:{}};");
injectTemp("base1");
//injectTemp("circle");
//injectTemp("searchResult");
//injectTemp("userFavorite");
injectScript("base.js");
