var mousex = 0;
var mousey = 0;
var grabx = 0;
var graby = 0;
var orix = 0;
var oriy = 0;
var elex = 0;
var eley = 0;
var algor = 0;
var drag_type = '';
var img_x = 0;
var img_y = 0;
var cTopL = new oCorner();
var cTopR = new oCorner();
var cBottomL = new oCorner();
var cBottomR = new oCorner();

function oCorner () {

    /* PUBLIC */
    this._minusX = 0;
    this._minusY = 0;

    this.x = 0;
    this.y = 0;
}

oCorner.prototype.setPos = function (new_x, new_y, direction){
    direction = direction || 1;

    this._minusX = new_x - this.x;
    this.x += this._minusX;
    this.y += direction * this._minusX;

//    this.x = new_x;
//    this.y = new_y;
}    

oCorner.prototype.checkTopLeftCorner = function(right, bottom){
    if(this.x < 0){
        this.x = 0;
    }
    if(this.y < 0){
        this.y = 0;
    }
    if(this.x > right - 10){
        this.x = right - 10;
    }
    if(this.y >= bottom -10){
        this.y = bottom -10;
    }
}

oCorner.prototype.checkTopRightCorner = function(left, bottom, img_x){
    if(this.x > img_x){
        this.x = img_x;
    }
    if(this.y < 0){
        this.y = 0;
    }
    if(this.x < left + 10){
        this.x = left + 10;
    }
    if(this.y >= bottom -10){
        this.y = bottom -10;
    }
}

oCorner.prototype.checkBottomLeftCorner = function(top, right, img_y){
    if(this.x < 0){
        this.x = 0;
    }
    if(this.y > img_y){
        this.y = img_y;
    }
    if(this.x > right - 10){
        this.x = right - 10;
    }
    if(this.y <= top + 10){
        this.y = top + 10;
    }
}

oCorner.prototype.checkBottomRightCorner = function(top, left, img_x, img_y){
    if(this.x > img_x){
        this.x = img_x;
    }
    if(this.y > img_y){
        this.y = img_y;
    }
    if(this.x < left + 10){
        this.x = left + 10;
    }
    if(this.y <= top + 10){
        this.y = top + 10;
    }
}

// setup our test canvas
// and a simple drawing function
window.onload = function() {
    
    // Icon size in pixels
    var icon_size = 128;

    function initSelect(size){
        cTopL.x = 0;
        cTopL.y = 0;
        cTopR.x = size;
        cTopR.y = 0;
        cBottomL.x = 0;
        cBottomL.y = size;
        cBottomR.x = size;
        cBottomR.y = size;
        setPosition();
    }

    function setPosition(){
        document.getElementById('select').style.width = cTopR.x - cTopL.x + 'px';
        document.getElementById('select').style.height = cBottomL.y - cTopL.y + 'px';
        document.getElementById('select').style.top = cTopL.y + 'px';
        document.getElementById('select').style.left = cTopL.x + 'px';
        document.getElementById('lefttop').style.top = cTopL.y-4 + 'px';
        document.getElementById('lefttop').style.left = cTopL.x-4 + 'px';
        document.getElementById('righttop').style.top = cTopR.y-4 + 'px';
        document.getElementById('righttop').style.left = cTopR.x-3 + 'px';
        document.getElementById('leftbottom').style.top = cBottomL.y-3 + 'px';
        document.getElementById('leftbottom').style.left = cBottomL.x-4 + 'px';
        document.getElementById('rightbottom').style.top = cBottomR.y-3 + 'px';
        document.getElementById('rightbottom').style.left = cBottomR.x-3 + 'px';
        updateIcon();
    }
    
    var dragobj = null;
    
    function falsefunc() { return false; } // used to block cascading events
    
    function init()
    {
        document.onmousemove = update; // update(event) implied on NS, update(null) implied on IE
        update();
    }
    
    function update(e) // works on IE6,FF,Moz,Opera7
    { 
        if (!e) e = window.event; // works on IE, but not NS (we rely on NS passing us the event)
        
        if (e)
        { 
            if (e.pageX || e.pageY)
            { // this doesn't work on IE6!! (works on FF,Moz,Opera7)
                mousex = e.pageX;
                mousey = e.pageY;
                algor = '[e.pageX]';
                if (e.clientX || e.clientY) 
                    algor += ' [e.clientX] '
            }
            else if (e.clientX || e.clientY)
            { // works on IE6,FF,Moz,Opera7
                mousex = e.clientX + document.body.scrollLeft;
                mousey = e.clientY + document.body.scrollTop;
                algor = '[e.clientX]';
                if (e.pageX || e.pageY) 
                    algor += ' [e.pageX] '
            }  
        }
    }
    
    
    function grab(context, type)
    {
        drag_type = type;
        document.onmousedown = falsefunc; // in NS this prevents cascading of events, thus disabling text selection
        dragobj = context;
        document.onmousemove = drag;
        document.onmouseup = drop;
        grabx = mousex;
        graby = mousey;
        elex = orix = parseInt(dragobj.offsetLeft);
        eley = oriy = parseInt(dragobj.offsetTop);
        update();
    }
    
    function drag(e) // parameter passing is important for NS family 
    {
        if (dragobj) {
            elex = orix + (mousex - grabx);
            eley = oriy + (mousey - graby);
            if(drag_type == 'lt'){
                cTopL.setPos(elex, eley);
                cTopL.checkTopLeftCorner(cTopR.x, cBottomL.y);
                cTopR.y = cTopL.y;
                cBottomL.x = cTopL.x;
            } else if (drag_type == 'rt') {
                cTopR.setPos(elex, eley, -1);
                cTopR.checkTopRightCorner(cTopL.x, cBottomR.y, img_x);
                cTopL.y = cTopR.y;
                cBottomR.x = cTopR.x;
            } else if (drag_type == 'lb') {
                cBottomL.setPos(elex, eley, -1);
                cBottomL.checkBottomLeftCorner(cTopL.y, cBottomR.x,img_y);
                cTopL.x = cBottomL.x;
                cBottomR.y = cBottomL.y;
            } else if (drag_type == 'rb') {
                cBottomR.setPos(elex, eley);
                cBottomR.checkBottomRightCorner(cTopR.y, cBottomL.x, img_x, img_y);
                cTopR.x = cBottomR.x;
                cBottomL.y = cBottomR.y;
            } else {
                var how_x = cTopR.x - cTopL.x;
                var how_y = cBottomL.y - cTopL.y;
                cTopL.x = elex;
                cTopL.y = eley;
                cTopL.checkTopLeftCorner();
                if(cTopL.x + how_x > img_x){
                    cTopL.x = img_x - how_x;
                }
                if(cTopL.y + how_y > img_y){
                    cTopL.y = img_y - how_y;
                }
                
                cTopR.x = cTopL.x + how_x;
                cTopR.y = cTopL.y;
                cBottomL.x = cTopL.x;
                cBottomL.y = cTopL.y + how_y;
                cBottomR.x = cTopR.x;
                cBottomR.y = cBottomL.y;
            }
            setPosition();
        }
        update(e);
        return false; // in IE this prevents cascading of events, thus text selection is disabled
    }
    
    function drop()
    {
        if (dragobj) {
            dragobj = null;
            drag_type = '';
        }
        update();
        document.onmousemove = update;
        document.onmouseup = null;
        document.onmousedown = null;   // re-enables text selection on NS
    }
    
    ///////////////////////////////////////////////////
    
    var bMouseIsDown = false;
    var oCanvas = document.getElementById("thecanvas");
    oCanvas.width = icon_size;
    oCanvas.height = icon_size;
    var oCtx = oCanvas.getContext("2d");
    var iWidth = oCanvas.width;
    var iHeight = oCanvas.height;
    var context = oCtx;
//    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1);
    var hashes = 'data:image/png;base64,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';
    var size = 0;
    
    var gloss_small = new Image();
    gloss_small.src = 'data:image/png;base64,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';
    var corners = new Image();
    corners.src = 'data:image/png;base64,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';
    
    var img = new Image();
    // Once it's loaded draw the image on the canvas.
    img.addEventListener('load', function () {
        img_x = img.width;
        img_y = img.height;
        size = img.width;
        if (size > img.height){
            size = img.height;
        }
        initSelect(size);
        updateIcon();
    }, false);
    img.src = hashes;
    document.getElementById('image').src = hashes;
    
    
    function updateIcon(){
        context.drawImage(img, cTopL.x, cTopL.y,  cTopR.x - cTopL.x,  cBottomL.y - cTopL.y,   0, 0, icon_size,  icon_size);
        
        context.drawImage(gloss_small, 0, 0, icon_size, icon_size);

        //cut out rounded corners
        context.globalCompositeOperation = 'destination-out';
        context.drawImage(corners, 0, 0, icon_size, icon_size);
        context.globalCompositeOperation = 'source-over';
    }
    
    
    
    function saveCanvas(pCanvas, strType) {
        var bRes = false;
        if (strType == "PNG")
        bRes = Canvas2Image.saveAsPNG(oCanvas);
        if (!bRes) {
            alert("Sorry, this browser is not capable of saving " + strType + " files!");
            return false;
        }
    }
    
    document.getElementById("savepngbtn").onclick = function() {
    saveCanvas(oCanvas, "PNG");
    }
    
    
    document.getElementById('lefttop').onmousedown = function(){
        grab(this, 'lt');
        event.stopPropagation();
    }
    document.getElementById('righttop').onmousedown = function(){
        grab(this, 'rt');
        event.stopPropagation();
    }
    document.getElementById('leftbottom').onmousedown = function(){
        grab(this, 'lb');
        event.stopPropagation();
    }
    document.getElementById('rightbottom').onmousedown = function(){
        grab(this, 'rb');
        event.stopPropagation();
    }
    document.getElementById('select').onmousedown = function(){
        grab(this, 'all');
        event.stopPropagation();
    }
    
    var imagesy = document.getElementById('buttoncontainer').getElementsByTagName('img');
    for(var x in imagesy){
        imagesy[x].onclick = function(){
            img.src = this.src;
            document.getElementById('image').src = this.src;
        }
    }
    
    var patterns = document.getElementById('buttoncontainer').getElementsByTagName('button');
    patterns[0].onclick = function(){
        gloss_small.src = 'data:image/png;base64,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';
        corners.src = 'cut1.png';
        updateIcon();
    }
    patterns[1].onclick = function(){
        gloss_small.src = 'data:image/png;base64,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'
        corners.src = 'cut1.png';
        updateIcon();
    }
    patterns[2].onclick = function(){
        gloss_small.src = 'gloss_3.png';
        corners.src = 'cut.png';
        updateIcon();
    }
    patterns[3].onclick = function(){
        gloss_small.src = 'gloss_4.png';
        corners.src = 'cut.png';
        updateIcon();
    }
    patterns[4].onclick = function(){
        gloss_small.src = 'gloss_5.png';
        corners.src = 'cut2.png';
        updateIcon();
    }
    patterns[5].onclick = function(){
        gloss_small.src = 'gloss_6.png';
        corners.src = 'cut.png';
        updateIcon();
    }
    patterns[6].onclick = function(){
        gloss_small.src = 'gloss_7.png';
        corners.src = 'cut.png';
        updateIcon();
    }
    

}