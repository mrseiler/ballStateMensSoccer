(function() {

    var width, height, largeHeader, canvas, ctx, points, target, animateHeader = true;

    // Main
    initHeader();
    initAnimation();
    addListeners();

    function initHeader() {
        width = window.innerWidth;
        height = window.innerHeight;
        target = {x: width/2, y: height/2};

        largeHeader = document.getElementById('large-header');
        largeHeader.style.height = height+'px';

        canvas = document.getElementById('demo-canvas');
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');
        
        // create points
        points = [];
        for(var x = 0; x < width; x = x + width/20) {
            for(var y = 0; y < height; y = y + height/20) {
                var px = x + Math.random()*width/20;
                var py = y + Math.random()*height/20;
                var p = {x: px, originX: px, y: py, originY: py };
                points.push(p);
            }
        }

        // for each point find the 5 closest points
        for(var i = 0; i < points.length; i++) {
            var closest = [];
            var p1 = points[i];
            for(var j = 0; j < points.length; j++) {
                var p2 = points[j]
                if(!(p1 == p2)) {
                    var placed = false;
                    for(var k = 0; k < 5; k++) {
                        if(!placed) {
                            if(closest[k] == undefined) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }

                    for(var k = 0; k < 5; k++) {
                        if(!placed) {
                            if(getDistance(p1, p2) < getDistance(p1, closest[k])) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }
                }
            }
            p1.closest = closest;
        }

        // assign a circle to each point
        for(var i in points) {
            var c = new Circle(points[i], 2+Math.random()*2, 'rgba(255,255,255,0.3)');
            points[i].circle = c;
        }
        
    }

    // Event handling
    function addListeners() {
        if(!('ontouchstart' in window)) {
            window.addEventListener('mousemove', mouseMove);
        }
        window.addEventListener('scroll', scrollCheck);
        window.addEventListener('resize', resize);
    }

    function mouseMove(e) {
        var posx = posy = 0;
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        }
        else if (e.clientX || e.clientY)    {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        target.x = posx;
        target.y = posy;
    }

    function scrollCheck() {
        if(document.body.scrollTop > height) animateHeader = false;
        else animateHeader = true;
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        largeHeader.style.height = height+'px';
        canvas.width = width;
        canvas.height = height;
    }

    // animation
    function initAnimation() {
        animate();
        for(var i in points) {
            shiftPoint(points[i]);
        }
    }

    function animate() {
        if(animateHeader) {
            ctx.clearRect(0,0,width,height);
            for(var i in points) {
                // detect points in range
                if(Math.abs(getDistance(target, points[i])) < 4000) {
                    points[i].active = 0.3;
                    points[i].circle.active = 0.6;
                } else if(Math.abs(getDistance(target, points[i])) < 20000) {
                    points[i].active = 0.1;
                    points[i].circle.active = 0.3;
                } else if(Math.abs(getDistance(target, points[i])) < 40000) {
                    points[i].active = 0.02;
                    points[i].circle.active = 0.1;
                } else {
                    points[i].active = 0;
                    points[i].circle.active = 0;
                }

                drawLines(points[i]);
                points[i].circle.draw();
            }
        }
        requestAnimationFrame(animate);
    }

    function shiftPoint(p) {
        TweenLite.to(p, 1+1*Math.random(), {x:p.originX-50+Math.random()*100,
            y: p.originY-50+Math.random()*100, ease:Circ.easeInOut,
            onComplete: function() {
                shiftPoint(p);
            }});
    }

    // Canvas manipulation
    function drawLines(p) {
        if(!p.active) return;
        for(var i in p.closest) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.closest[i].x, p.closest[i].y);
            ctx.strokeStyle = 'rgba(156,217,249,'+ p.active+')';
            ctx.stroke();
        }
    }

    function Circle(pos,rad,color) {
        var _this = this;

        // constructor
        (function() {
            _this.pos = pos || null;
            _this.radius = rad || null;
            _this.color = color || null;
        })();

        this.draw = function() {
            if(!_this.active) return;
            ctx.beginPath();
            ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(156,217,249,'+ _this.active+')';
            ctx.fill();
        };
    }

    // Util
    function getDistance(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    }
    
})();

/*=================
--------Navbar-----
=================*/
// When the user scrolls the page, execute myFunction 
window.onscroll = function() {myFunction()};

// Get the navbar
var navbar = document.getElementById("navBar");

// Get the offset position of the navbar
var sticky = navbar.offsetTop;

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
  }
}

/*===========================
==========================
========================
=====================*/
window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(callback) {
    window.setTimeout(callback, 1000 / 60);
};
})();

function initBalls() {
balls = [];

var blue = '#3A5BCD';
var img = document.createElement("img");
img.src = "./assets/soccerBall.png";


balls.push(new Ball(620, 340, 0, 0, blue));



return balls;
}
function getMousePos(canvas, evt) {
// get canvas position
var obj = canvas;
var top = 0;
var left = 0;
while(obj.tagName != 'BODY') {
  top += obj.offsetTop;
  left += obj.offsetLeft;
  obj = obj.offsetParent;
}

// return relative mouse position
var mouseX = evt.clientX - left + window.pageXOffset;
var mouseY = evt.clientY - top + window.pageYOffset;
return {
  x: mouseX,
  y: mouseY
};
}
function updateBalls(canvas, balls, timeDiff, mousePos) {
var context = canvas.getContext('2d');
var collisionDamper = 0.3;
var floorFriction = 0.0005 * timeDiff;
var mouseForceMultiplier = 1 * timeDiff;
var restoreForce = 0.002 * timeDiff;

for(var n = 0; n < balls.length; n++) {
  var ball = balls[n];
  // set ball position based on velocity
  ball.y += ball.vy;
  ball.x += ball.vx;

  // restore forces
  if(ball.x > ball.origX) {
    ball.vx -= restoreForce;
  }
  else {
    ball.vx += restoreForce;
  }
  if(ball.y > ball.origY) {
    ball.vy -= restoreForce;
  }
  else {
    ball.vy += restoreForce;
  }

  // mouse forces
  var mouseX = mousePos.x;
  var mouseY = mousePos.y;

  var distX = ball.x - mouseX;
  var distY = ball.y - mouseY;

  var radius = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));

  var totalDist = Math.abs(distX) + Math.abs(distY);

  var forceX = (Math.abs(distX) / totalDist) * (1 / radius) * (mouseForceMultiplier-10);
  var forceY = (Math.abs(distY) / totalDist) * (1 / radius) * (mouseForceMultiplier-10);

  if(distX > 0) {// mouse is left of ball
    ball.vx += forceX;
  }
  else {
    ball.vx -= forceX;
  }
  if(distY > 0) {// mouse is on top of ball
    ball.vy += forceY;
  }
  else {
    ball.vy -= forceY;
  }

  // floor friction
  if(ball.vx > 0) {
    ball.vx -= floorFriction;
  }
  else if(ball.vx < 0) {
    ball.vx += floorFriction;
  }
  if(ball.vy > 0) {
    ball.vy -= floorFriction;
  }
  else if(ball.vy < 0) {
    ball.vy += floorFriction;
  }

  // floor condition
  if(ball.y > (canvas.height - ball.radius)) {
    ball.y = canvas.height - ball.radius - 2;
    ball.vy *= -1;
    ball.vy *= (1 - collisionDamper);
  }

  // ceiling condition
  if(ball.y < (ball.radius)) {
    ball.y = ball.radius + 2;
    ball.vy *= -1;
    ball.vy *= (1 - collisionDamper);
  }

  // right wall condition
  if(ball.x > (canvas.width - ball.radius)) {
    ball.x = canvas.width - ball.radius - 2;
    ball.vx *= -1;
    ball.vx *= (1 - collisionDamper);
  }

  // left wall condition
  if(ball.x < (ball.radius)) {
    ball.x = ball.radius + 2;
    ball.vx *= -1;
    ball.vx *= (1 - collisionDamper);
  }
}
}
function Ball(x, y, vx, vy, color) {
this.x = x;
this.y = y;
this.vx = vx;
this.vy = vy;
this.color = color;
this.origX = x;
this.origY = y;
this.radius = 20;
}
function animate(canvas, balls, lastTime, mousePos) {
var context = canvas.getContext('2d');

// update
var date = new Date();
var time = date.getTime();
var timeDiff = time - lastTime;
updateBalls(canvas, balls, timeDiff, mousePos);
lastTime = time;

// clear
context.clearRect(0, 0, canvas.width, canvas.height);

// render
for(var n = 0; n < balls.length; n++) {
  var ball = balls[n];
  context.beginPath();
  context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
  context.fillStyle = ball.color;
  context.fill();
}

// request new frame
requestAnimFrame(function() {
  animate(canvas, balls, lastTime, mousePos);
});
}
var canvas = document.getElementById('demo-canvas');
var balls = initBalls();
var date = new Date();
var time = date.getTime();
/*
* set mouse position really far away
* so the mouse forces are nearly obsolete
*/

var mousePos = {
x: 9999,
y: 9999
};

canvas.addEventListener('mousemove', function(evt) {
var pos = getMousePos(canvas, evt);
mousePos.x = pos.x;
mousePos.y = pos.y;
});

canvas.addEventListener('mouseout', function(evt) {
mousePos.x = 9999;
mousePos.y = 9999;
});
animate(canvas, balls, time, mousePos);

