(function() {

    var width, height, largeHeader, canvas, ctx, circles, target, animateHeader = true;

    // Main
    initHeader();
    addListeners();

    function initHeader() {
        largeHeader = document.getElementById('large-header');
        canvas = document.getElementById('demo-canvas');
        ctx = canvas.getContext('2d');
        resize();

        // create particles
        circles = [];
        for(var x = 0; x < width*2; x++) {
            var c = new Circle();
            circles.push(c);
        }
        animate();
    }

    // Event handling
    function addListeners() {
        window.addEventListener('scroll', scrollCheck);
        window.addEventListener('resize', resize);
    }

    function scrollCheck() {
        if(document.body.scrollTop > height) animateHeader = false;
        else animateHeader = true;
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        target = {x: width/2, y: height/2};
        largeHeader.style.height = height+'px';
        canvas.width = width;
        canvas.height = height;
    }

    function animate() {
        if(animateHeader) {
            ctx.clearRect(0,0,width,height);
            for(var i in circles) {
                circles[i].draw();
            }
        }
        requestAnimationFrame(animate);
    }

    // Canvas manipulation
    function Circle() {
        var _this = this;

        // constructor
        (function() {
            _this.pos = {};
            init();
            console.log(_this);
        })();

        function init() {
            var starting = [
                // bottom
                {x: Math.random()*width, y: height+Math.random()*100 }, 
                // top
                {x: Math.random()*width, y: 0}, 
                // left
                {x: 0, y: height*Math.random()}, 
                // right
                {x: width, y: height*Math.random() }
            ];
            var choice = starting[Math.floor(Math.random() * starting.length)];
            _this.pos.x = choice.x;
            _this.pos.y = choice.y;
            _this.alpha = 0.1+Math.random()*0.3;
            _this.scale = 0.1+Math.random()*0.2;
            _this.velocity = Math.random()*0.003;
        }

        this.draw = function() {
            var distanceToCenter = {
                x: (target.x - _this.pos.x) * _this.velocity,
                y: (target.y - _this.pos.y) * _this.velocity
            };

            if(_this.alpha <= 0) {
                init();
            }
            _this.pos.x += distanceToCenter.x;
            _this.pos.y += distanceToCenter.y;
            _this.alpha -= 0.003;
            ctx.beginPath();
            ctx.arc(_this.pos.x, _this.pos.y, _this.scale*10, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(200,176,93,'+ _this.alpha+')';
            ctx.fill();
        };
    }

})();