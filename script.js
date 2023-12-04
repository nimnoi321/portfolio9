const bganimation = document.getElementById
('bganimation');

const number0fColorBoxes = 400

for (let i=0;i < number0fColorBoxes; i++){
    const colorBox = document.createElement
    ('div');
    colorBox.classList.add('colorbox');
    bganimation.append(colorBox)
}

const cursor = document.querySelectorAll(".cursor");
const links = document.querySelectorAll(".subtitle, .p33, .j33, .head90, .skill-bar");

window.addEventListener("mousemove", (e) => {
  
  let x = e.pageX;
  let y = e.pageY;
  
  cursor.forEach(el => {
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    
    links.forEach(link => {
      link.addEventListener("mouseenter", () => {
        el.classList.add("hover");
      })
      link.addEventListener("mouseleave", () => {
        el.classList.remove("hover");
        
      })
    })
    
  })
  
})
// Yet Another Particle Engine
var cos = Math.cos,
    sin = Math.sin,
    sqrt = Math.sqrt,
    abs = Math.abs,
    atan2 = Math.atan2,
    log = Math.log,
    random = Math.random,
    PI = Math.PI,
    sqr = function(v){return v*v;},
    particles = [],
    drawScale = 1,
    emitters = [],
    forces  = [],
    collidedMass = 0,
    maxParticles = 100,
    emissionRate = 1;

//-------------------------------------------------------
// Vectors, and not the kind you put stuff in
function Vector(x, y, z) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
}
Vector.prototype = {
  add : function(vector) {
    this.x += vector.x;
    this.y += vector.y;
    this.z += vector.z;
    return this;
  },
  subtract : function(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    this.z -= vector.z;
    return this;
  },
  multiply : function(another) {
    this.x /= another.x;
    this.y /= another.y;
    this.z /= another.z;
    return this;
  },
  divide : function(another) {
    this.x /= another.x;
    this.y /= another.y;
    this.z /= another.z;
    return this;
  },
  scale : function(factor) {
    this.x *= factor;
    this.y *= factor;  
    this.z *= factor;  
    return this;      
  },
  magnitude : function () {
    return sqrt(sqr(this.x + this.y));
  },
  distance : function (another) {
    return abs(sqrt(sqr(this.x - another.x) + sqr(this.y - another.y)));
  },
  angle : function (angle, magnitude) {
    if(angle && magnitude)
      return Vector.fromAngle(angle, magnitude);
    return atan2(this.y, this.x);
  },
  clone : function() {
    return new Vector(this.x, this.y, this.z);
  },
  equals : function(another) {
    return this.x === another.x 
        && this.y === another.y
        && this.z === another.z;
  },
  random : function(r) {
    this.x += (random() * r * 2) - r;
    this.y += (random() * r * 2) - r;
    return this;
  }
};
Vector.fromAngle = function (angle, magnitude) {
  return new Vector(
    magnitude * cos(angle), 
    magnitude * sin(angle),
    magnitude * sin(angle));
};

//******************************************************
// A thing with mass, position, and velocity - like your mom
function Particle(pt, vc, ac, mass) {
  this.pos = pt || new Vector(0, 0);
  this.vc = vc || new Vector(0, 0);
  this.ac = ac || new Vector(0, 0);
  this.mass = mass || 1;
  this.alive = true;
}
Particle.prototype.move = function () {
  this.vc.add(this.ac);
  this.pos.add(this.vc);
};
Particle.prototype.reactToForces = function (fields) {
  var totalAccelerationX = 0;
  var totalAccelerationY = 0;
  
  for (var i = 0; i < fields.length; i++) {
    var field = fields[i];
    var vectorX = field.pos.x - this.pos.x;
    var vectorY = field.pos.y - this.pos.y;
    var distance = this.pos.distance(field.pos);
    if(distance < 1) field.grow(this);
    if(distance < 100) this.doubleSize = true;
    var force = G(this.forceBetween(field, distance));
    totalAccelerationX += vectorX * force;
    totalAccelerationY += vectorY * force;
  }
  this.ac = new Vector(totalAccelerationX, totalAccelerationY);
  
  totalAccelerationX = 0;
  totalAccelerationY = 0;
  for (var i = 0; i < particles.length; i++) {
    var field = particles[i];
    if(field === this || !field.alive) continue;
    var vectorX = field.pos.x - this.pos.x;
    var vectorY = field.pos.y - this.pos.y;
    var distance = this.pos.distance(field.pos);
    if(distance < 1) {
      if(this.mass >= field.mass) {
        var massRatio = this.mass / field.mass;
        if(particles.length <= maxParticles && this.mass>40) {
          this.alive = false;
          this.nova = true;
          collidedMass += this.mass;
        } else this.grow(field);
      } else this.alive = false;
    }
    if(this.alive) {
      var force = G(this.forceBetween(field, distance));
      totalAccelerationX += vectorX * G(force);
      totalAccelerationY += vectorY * G(force);
    }
  }

  var travelDist = this.pos.distance(this.lastPos ? this.lastPos : this.pos);
  this.velocity = travelDist - (this.lastDistance ? this.lastDistance : travelDist);
  this.lastDistance = travelDist;
  this.lastPos = this.pos.clone();

  this.ac.add(new Vector(totalAccelerationX, totalAccelerationY));
  this.lastPos = this.pos.clone();
  // if(this.mass > 20) {
  //   var chance = 1 / (this.mass - 20);
  //   if(Math.random()>chance) {
  //     this.supernova = true;
  //     this.supernovaDur = 10;
  //     this.alive = false;
  //     if(particles.length <= maxParticles) collidedMass += this.mass;
  //     delete this.size;
  //   }
  // }
};
Particle.prototype.grow = function (another) {
  this.mass += another.mass;
  this.nova = true;
  another.alive = false;
  delete this.size;
};
Particle.prototype.breakApart = function(minMass, maxParts) {
  if(!minMass) minMass = 1;
  if(!maxParts) maxParts = 2;
  var remainingMass = this.mass;
  var num = 0;
  while(remainingMass > 0) {
    var np = new Particle(this.pos.clone().random(this.mass), new Vector(0,0));
    np.mass = 1 + Math.random() * (remainingMass - 1);
    if(num>=maxParts-1) np.mass = remainingMass;
    np.mass = np.mass < minMass ? minMass : np.mass;
    remainingMass -= np.mass;
    num++;
  }
  this.nova = true;
  delete this.size;
  this.alive = false;
};
Particle.prototype.forceBetween = function(another, distance) {
  var distance = distance? distance : this.pos.distance(another.pos);
  return (this.mass * another.mass) / sqr(distance);
};

//******************************************************
//This certainly doesn't *sub*mit to particles, that's for sure
function ParticleEmitter(pos, vc, ang) {
  // to do config options for emitter - random, static, show emitter, emitter color, etc
  this.pos = pos; 
  this.vc = vc; 
  this.ang = ang || 0.09; 
  this.color = "#999"; 
}
ParticleEmitter.prototype.emit = function() {
  var angle = this.vc.angle() + 
      this.ang - (Math.random() * this.ang * 2);
  var magnitude = this.vc.magnitude();
  var position = this.pos.clone();
        position.add(
        new Vector(
          ~~((Math.random() * 100) - 50) * drawScale,       
          ~~((Math.random() * 100) - 50) * drawScale
        ));
  var velocity = Vector.fromAngle(angle, magnitude);
  return new Particle(position,velocity);
};

//******************************************************
// Use it, Luke
// to do collapse functionality into particle
function Force(pos, m) {
  this.pos = pos;
  this.mass = m || 100;
}
Force.prototype.grow = function (another) {
  this.mass += another.mass;
  this.burp = true;
  another.alive = false;
};



function G(data) {
  return 0.00674 * data;
}

//******************************************************
var canvas = document.querySelector('#scene');
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;

var renderToCanvas = function (width, height, renderFunction) {
    var buffer = document.createElement('canvas');
    buffer.width = width;
    buffer.height = height;
    renderFunction(buffer.getContext('2d'));
    return buffer;
};

maxParticles = 500; 
emissionRate = 1; 
drawScale = 1.3;
minParticleSize = 2;
emitters = [
  //br
  new ParticleEmitter(
    new Vector(
      canvasWidth / 2 * drawScale + 400, 
      canvasHeight / 2 * drawScale
      ), 
    Vector.fromAngle(2, 5),
    1
  ),
  //   // bl
  //   new ParticleEmitter(
  //   new Vector(
  //     canvasWidth / 2 * drawScale - 400, 
  //     canvasHeight / 2 * drawScale + 400
  //     ), 
  //   Vector.fromAngle(1.5, 1),
  //   1
  // ),
    // tl
  new ParticleEmitter(
    new Vector(
      canvasWidth / 2 * drawScale - 400, 
      canvasHeight / 2 * drawScale
      ), 
    Vector.fromAngle(5, 5),
    1
  ),
  //   // tr
  //   new ParticleEmitter(
  //   new Vector(
  //     canvasWidth / 2 * drawScale + 400, 
  //     canvasHeight / 2 * drawScale - 400
  //     ), 
  //   Vector.fromAngle(4.5, 1),
  //   1
  // )
];
forces  = [
  new Force(
    new Vector((canvasWidth / 2 * drawScale) ,
               (canvasHeight / 2 * drawScale)), 1800)
];

function loop() {
  clear();
  update();
  draw();
  queue();
}
 
function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
    
var ctr = 0;
var c = [
  'rgba(255,255,255,',
  'rgba(0,150,255,',
  'rgba(255,255,128,',
  'rgba(255,255,255,'
];
function rndc() {
  return c[~~(Math.random() * c.length-1)];
}
var c2 = 'rgba(255,64,32,';
function addNewParticles() {
  var _emit = function() {
    var ret = 0;
    for (var i = 0; i < emitters.length; i++) {
      for (var j = 0; j < emissionRate; j++) {
        var p = emitters[i].emit();
        p.color = ( ctr % 10 === 0 )
          ? ( Math.random() * 5 <= 1 ? c2 : rndc() ) 
          : rndc();
        p.mass = ~~(Math.random() * 5);
        particles.push(p);
        ret += p.mass;
        ctr++;
      }
    }
    return ret;
  };
  if(collidedMass !== 0) {
    while(collidedMass !== 0) {
      collidedMass -= _emit();
      collidedMass = collidedMass<0 ? 0 :collidedMass;
    }
  }
  if (particles.length > maxParticles) 
    return;
  _emit();
}

var CLIPOFFSCREEN = 1,
    BUFFEROFFSCREEN = 2,
    LOOPSCREEN = 3;

function isPositionAliveAndAdjust(particle,check) {
  return true;
  var pos = particle.pos;
  if(!check) check = BUFFEROFFSCREEN;
  if(check === CLIPOFFSCREEN) {
    return !(!particle.alive || 
             pos.x < 0 || 
             (pos.x / drawScale) > boundsX || 
             pos.y < 0 || 
             (pos.y / drawScale) > boundsY);
  } else if(check === BUFFEROFFSCREEN) {
    return !(!particle.alive || 
             pos.x < -boundsX * drawScale || 
             pos.x > 2 * boundsX * drawScale || 
             pos.y < -boundsY * drawScale || 
             pos.y > 2 * boundsY * drawScale);      
  } else if(check === LOOPSCREEN) {
    if (pos.x < 0) pos.x = boundsX * drawScale;
    if ((pos.x / drawScale) > boundsX) pos.x = 0;
    if (pos.y < 0) pos.y = boundsY * drawScale;
    if ((pos.y / drawScale) > boundsY) pos.y = 0;
    return true;
  }
}

function plotParticles(boundsX, boundsY) {
  var currentParticles = [];
  for (var i = 0; i < particles.length; i++) {
    var particle = particles[i];
    particle.reactToForces(forces);
    if(!isPositionAliveAndAdjust(particle))
      continue;
    particle.move();
    currentParticles.push(particle);
  }
}

var offscreenCache = {};
function renderParticle(p) {
    var position = p.pos;
    if(!p.size) p.size = Math.floor(p.mass / 100);

    
    if(!p.opacity) p.opacity = 0.05;
    if(p.velocity > 0) {
      if(p.opacity<=0.18)
        p.opacity += 0.04;
    }
      if(p.opacity>0.08)
        p.opacity -= 0.02;

    var actualSize = p.size / drawScale;
    actualSize = actualSize < minParticleSize ? minParticleSize : actualSize;
    if(p.mass>8) actualSize *= 2;
    if(p.nova) {
      actualSize *= 4;
      p.nova = false;
    }
    if(p.doubleSize) {
      p.doubleSize = false;
      actualSize *= 2;
    }
    // if(p.supernova) {
    //   actualSize *= 6;
    //   opacity = 0.15;
    //   p.supernovaDur = p.supernovaDur - 1;
    //   if(p.supernovaDur === 0)
    //     p.supernova = false;
    // }
    var cacheKey = actualSize + '_' + p.opacity + '_' + p.color;
    var cacheValue = offscreenCache[cacheKey];
    if(!cacheValue) {
      cacheValue = renderToCanvas(actualSize * 32, actualSize * 32, function(ofsContext) {
        var opacity = p.opacity;
        var fills = [
          {size:actualSize/2,  opacity:1},
          {size:actualSize,  opacity:opacity},
          {size:actualSize * 2, opacity:opacity / 2},
          {size:actualSize * 4, opacity:opacity / 3},
          {size:actualSize * 8, opacity:opacity / 5},
          {size:actualSize * 16, opacity:opacity / 16}
        ];
        ofsContext.beginPath();
        for(var f in fills) {
          f = fills[f];
          ofsContext.fillStyle = p.color + f.opacity + ')';
          ofsContext.arc(
            actualSize * 16, 
            actualSize * 16, 
            f.size , 0, Math.PI*2, true); 
          ofsContext.fill();
        }
        ofsContext.closePath();
      });
      offscreenCache[cacheKey] = cacheValue;    
    } 
      var posX = p.pos.x / drawScale;
    var posY = p.pos.y / drawScale;
    ctx.drawImage(cacheValue, posX, posY);
}

var fills = [
  {size:15,opacity:1  },
  {size:25,opacity:0.3},
  {size:50,opacity:0.1} ];

function renderScene(ofsContext) {
  for (var i = 0; i < forces.length; i++) {
    var p = forces[i];
    var position = p.pos;
    var opacity = 1;
    
    ofsContext.beginPath();
    for(var f in fills) {
      f = fills[f];
      var o = p.burp === true ? 1 : f.opacity;
      p.burp = false;
      // ofsContext.fillStyle = 'rgba(255,255,255,' + o + ')';
      // ofsContext.arc(position.x / drawScale, 
      //   position.y / drawScale, 
      //   f.size / drawScale, 0, Math.PI*2, true); 
      // ofsContext.fill();
    }
    ofsContext.closePath();
  }
  
  for (var i = 0; i < particles.length; i++) {
    var p = particles[i];
    renderParticle(p);
  }
}

function draw() { 
  renderScene(ctx);
}

function update() {
  addNewParticles();
  plotParticles(canvas.width, canvas.height);
}
 
function queue() {
  window.requestAnimationFrame(loop);
}

$('canvas').mousedown(function(e){

});

$('canvas').mouseup(function(e){

});

loop();

$(document).ready(function() {
  var movementStrength = 25;
  var height = movementStrength / $(window).height();
  var width = movementStrength / $(window).width();
  $("#header").mousemove(function(e){
            var pageX = e.pageX - ($(window).width() / 2);
            var pageY = e.pageY - ($(window).height() / 2);
            var newvalueX = width * pageX * -1 - 25;
            var newvalueY = height * pageY * -1 - 50;
            $('#header').css("background-position", newvalueX+"px     "+newvalueY+"px");
  });
  });
/* ---- particles.js config ---- */

/*////particlesJS("skills",{
    "particles": {
      "number": {
        "value": 90,
        "density": {
          "enable": true,
          "value_area": 315
        }
      },
      "color": {
        "value": "#ffffff"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        },
        "polygon": {
          "nb_sides": 5
        },
        "image": {
          "src": "img/github.svg",
          "width": 100,
          "height": 100
        }
      },
      "opacity": {
        "value": 0.5,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 0.2,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 3,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 1,
          "size_min": 0.5,
          "sync": false
        }
      },
      "line_linked": {
        "enable": false,
        "distance": 150,
        "color": "#ffffff",
        "opacity": 0.4,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 0.3,
        "direction": "none",
        "random": true,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "grab"
        },
        "onclick": {
          "enable": true,
          "mode": "push"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 140,
          "line_linked": {
            "opacity": 1
          }
        },
        "bubble": {
          "distance": 400,
          "size": 40,
          "duration": 2,
          "opacity": 8,
          "speed": 3
        },
        "repulse": {
          "distance": 200,
          "duration": 0.4
        },
        "push": {
          "particles_nb": 4
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true
  });
  
  
  /* ---- stats.js config ---- */
  
 ///* var count_particles, stats, update;
  //*stats = new Stats;
 // stats.setMode(0);
  //stats.domElement.style.position = 'absolute';
  //stats.domElement.style.left = '0px';
 // stats.domElement.style.top = '0px';
  //document.body.appendChild(stats.domElement);
  //count_particles = document.querySelector('.js-count-particles');
  //update = function() {
   // stats.begin();
   // stats.end();
   // if (window.pJSDom[0].pJS.particles && window.pJSDom[0].pJS.particles.array) {
   //   count_particles.innerText = window.pJSDom[0].pJS.particles.array.length;
  //  }
  //  requestAnimationFrame(update);
 // };
 // requestAnimationFrame(update);

 /*var cursor = document.querySelector('.cursor'),
 cursorscale =  document.querySelectorAll('.cursor-scale'),
      mouseX = 0,
      mouseY = 0

 gsap.to({}, 0.016, {
  repeat: -1,

  onRepeat:  function() {
    gsap.set(cursor, {
      css: {
        left: mouseX,
        top: mouseY
      }
    })
  }
 });

 Window.addEventListener("mousemove", function (e){
  mouseX = e.clientX;
  mouseY = e.clientY
 });

 cursorscale.forEach(link=>{
  link.addEventListener('mouseleave', () => {
    cursor.classList.remove('grow');
    cursor.classList.add('grow-small');
  });
  link.addEventListener('mousemove', () => {
    cursor.classList.add('grow');
    if(link.classList.contains('small')){
      cursor.classList.add('grow');
      cursor.classList.add('grow-small');
    }
  });

 });*/

 