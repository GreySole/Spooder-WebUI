global.$ = (selector) => {
	return document.querySelector(selector);
}

global.setClass = (el, classname, bool) => {
	if(bool==null){bool = true;}
	if(bool){
		el.classList.add(classname);
	}else{
		el.classList.remove(classname);
	}
}

global.toggleClass = (el, classname) => {
	if(el == null){return;}
	let hasClass = el.classList.contains(classname);
	if(hasClass){
		el.classList.remove(classname);
	}else{
		el.classList.add(classname);
	}
	return el.classList.contains(classname);
}

global.radioClass = (classname, selector, selected) => {
	let selectGroup = document.querySelectorAll(selector);
	selectGroup.forEach((e,i) => {
		e.classList.remove(classname);
	})
	
	selected.classList.add(classname);
}

global.mediaExtensions = {
	image:[".jpg",".jpeg",".png", ".tif", ".webp", ".svg", ".gif", ".xbm", ".jfif", ".ico", ".svgz", ".bmp", ".pjp", ".apng", ".pjpeg", ".avif"],
	sound:[".wav",".mp3",".aiff", ".ogg", ".opus", ".flac", ".webm", ".weba", ".m4a", ".oga", ".mid", ".aiff", ".wma", ".au"],
	audio:[".wav",".mp3",".aiff", ".ogg", ".opus", ".flac", ".webm", ".weba", ".m4a", ".oga", ".mid", ".aiff", ".wma", ".au"],
	video:[".mp4", ".webm", ".ogm", ".wmv", ".mpg", ".ogv", ".mov", ".asx", ".mpeg", ".m4v", ".avi"]
}

global.getMediaHTML = (filePath) =>{
	
	switch(window.getMediaType(filePath)){
		case 'image':
			return <img src={filePath} />
		break;
		case 'sound':
			return <source src={filePath}/>
		break;
		case 'video':
			return <video controls>
					<source src={filePath} />
				</video>
		break;
	}
}

global.getMediaType = (file) => {
	
	for(let type in window.mediaExtensions){
		for(let ext in window.mediaExtensions[type]){
			if(file.toLowerCase().endsWith(window.mediaExtensions[type][ext])){
				
				return type;
			}
		}
	}
	return null;
}