//read an image over socket.io
var socket = io();
socket.on('sendimage', function(data) {
    var uint8Arr = new Uint8Array(data);
    var binary = '';
    for (var i = 0; i < uint8Arr.length; i++) {
        binary += String.fromCharCode(uint8Arr[i]);
    }
    var base64String = window.btoa(binary);

    var img = new Image();
    var canv = document.getElementById('mycanvas');
    var ctx = canv.getContext('2d');
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height =  window.innerHeight;

            
    var div = document.getElementById('container');


    div.appendChild(canv);
    img.onload = function() {
        var x = 0, y = 0;
        ctx.drawImage(this, x, y);
    }
    img.src = 'data:image/jpg;base64,' + base64String;

    //drawing
    var clickX = new Array();
    var clickY = new Array();
    var clickDrag = new Array();
    var paint;

    //colors
    var colorPurple = "#cb3594";
    var colorGreen = "#659b41";
    var colorYellow = "#ffcf33";
    var colorBrown = "#986928";

    var curColor = colorPurple;
    var clickColor = new Array();

    //save click position
    function addClick(x, y, dragging)
    {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
    clickColor.push(curColor);
    }

    //redraw on canvas
    function redraw(){
    /* context.strokeStyle = "#df4b26"; */
    ctx.lineJoin = "round";
    ctx.lineWidth = 5;
                
    for(var i=0; i < clickX.length; i++)
    {		
        ctx.beginPath();
        if(clickDrag[i] && i){
        ctx.moveTo(clickX[i-1], clickY[i-1]);
        }else{
        ctx.moveTo(clickX[i]-1, clickY[i]);
        }
        ctx.lineTo(clickX[i], clickY[i]);
        ctx.closePath();
        ctx.strokeStyle = clickColor[i];
        ctx.stroke();
    }
    }

    $('#mycanvas').mousedown(function(e){
    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;
            
    paint = true;
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    redraw();
    });
    $('#mycanvas').mousemove(function(e){
    if(paint){
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
        redraw();
    }
    });
    $('#mycanvas').mouseup(function(e){
    paint = false;
    });
    $('#mycanvas').mouseleave(function(e){
    paint = false;
    });

    $( "#purplebtn" ).click(function() {
    curColor = colorPurple;
    });
    $( "#greenbtn" ).click(function() {
    curColor = colorGreen;
    });
    $( "#yellowbtn" ).click(function() {
    curColor = colorYellow;
    });
    $( "#brownbtn" ).click(function() {
    curColor = colorBrown;
    });
    $( "#purplebtn" ).click(function() {
    curColor = colorPurple;
    });
    $( "#clear" ).click(function() {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clears the canvas
        ctx.drawImage(img, 0, 0);
        clickX = new Array();
        clickY = new Array();
        clickDrag = new Array();
        clickColor = new Array();

    });

    //Send the canvas over socket.io
    var finalPNG;
    $( "#send" ).click(function() {
        socket.emit('sendimage', canv.toDataURL("image/png"));
    });

});