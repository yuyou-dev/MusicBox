var MotionRect = function(v1 = new Vec2d(0,0),v2 = new Vec2d(0,0),number = 0){
    this.v1 = v1;
    this.v2 = v2;
    this.number = number;

    this.lastTime = 0
    this.currentRadius = 0
    this.targetRadius = 0
    this.w = this.getWidth();
    this.h = this.getHeight();
    this.dir = 1
    this.depth = 0
    this.targetDepth = 0
    this.count = 0

    this.c = this.getColor()
}
var counter = 0;
var deck = []
for(var i = 0 ; i < 128 ; i ++){
    deck.push(i);
}
MotionRect.prototype = {
    getWidth:function(){
        return Math.abs(this.v2.x - this.v1.x);
    },
    getHeight:function(){
        return Math.abs(this.v2.y - this.v1.y);
    },
    area:function(){
        return this.getWidth()  * this.getHeight()
    },
    setNumber:function(number){
        this.number = number;
    },
    copy:function(){
        return new MotionRect(this.v1.copy(),this.v2.copy(),this.number);
    },
    changeRadiusTo:function(targetRadius){
        if(targetRadius < 0)targetRadius = 0;
        if(targetRadius > min(this.w,this.h) / 2.0){
            targetRadius = min(this.w,this.h) / 2.0
        }
        this.targetRadius = targetRadius;
    },
    update:function(current){
        if (millis() - this.lastTime > 1000){
            this.targetDepth = map(random(),0,1,0,300)
            this.count = this.count + 1
            var endValue;
            if(random() < 0.5){
                this.dir = 1;
            }else{
                this.dir = -1;
            }
            if(this.count == 5){
                this.count = 0;
                endValue = 0
                this.targetDepth = 0;
            }else{
                endValue = map(this.dir,-1,1,0,min(this.w,this.h) / 2.0)
            }
            this.lastTime = millis()
            this.changeRadiusTo(endValue);
        }
        var dr = this.targetRadius - this.currentRadius;
        var dd = this.targetDepth - this.depth;
        if(abs(dd) > 1){
            this.depth += dd / 5;
        }
        if(abs(dr) > 1){
            this.currentRadius += dr / 5.0
        }else{
            this.currentRadius = this.targetRadius;
        }
    },
    getColor:function(){

        var colors = [
           [13,127,190],
            [245,10,10],
            [251,228,20],
            [255,255,255]
            ]
            
        return colors[parseInt(4*Math.random())]
    },
    display:function(current){
        this.update(current);
        push();
        translate(0,0,map(current[this.number],0,50,0,300))
        fill(this.c[0],this.c[1],this.c[2],map(this.currentRadius,0,min(this.w,this.h) / 2.0,255,0));
        rect2(this.v1.x,this.v1.y,this.v2.x,this.v2.y,this.currentRadius);
        pop();
    }
}

var Divider = function(type = 'none',level = 0,x = 0.5,y = 0.5){
    this.type = type;
    this.x = x;
    this.y = y;
    this.level = level;
    this.children = [];
}

var RectManager = function(root){
    this.divide(root,3);
    this.root = root || false;
    this.rectGroup = [];
}
RectManager.prototype = {
    divide:function(divider,level){
        if(level < 1)return;
        var grid = [];
        for(var i = 0 ; i < 4 ; i ++){
            var dx = 0.5;
            var dy = 0.5;
            if(level > 1){
                var nextType = 'full';
                if(random() > 0.3)nextType = 'none';
                var nextDivider = new Divider(nextType,level - 1,dx,dy);
                this.divide(nextDivider,level - 1);
                grid.push(nextDivider);
            }else{
                grid.push(new Divider('none',level - 1));
            }
        }
        divider.children = grid;
    },
    addRect:function(subRect){
        this.rectGroup.push(subRect.copy())
    },
    display:function(current){
        for(var r in this.rectGroup){
            this.rectGroup[r].display(current);
        }
    },
    getSubRectGroup(bRect,dv){
        var v1 = bRect.v1.copy();
        var v2 = bRect.v2.copy();
        var xRange = [v1.x,map(dv.x,0,1,v1.x,v2.x),v2.x]
        var yRange = [v1.y,map(dv.y,0,1,v1.y,v2.y),v2.y]
        var data = [];
        for(var i = 0 ; i < 3; i ++){
            for(var j = 0 ; j < 3 ; j ++){
                if(i < 2 && j < 2){
                    var sv1 = new Vec2d(xRange[i],yRange[j]);
                    var sv2 = new Vec2d(xRange[i + 1],yRange[j + 1]);

                    var subRect = new MotionRect(sv1,sv2,counter);
                    counter ++;
                    data.push(subRect);
                }
            }
        }
        return data;
    },
    createDivider:function(dRect,dv = false){
        if(dv == false){
            dv = this.root;
        }
        if(dv.type == 'none'){
            this.addRect(dRect.copy())
            return;
        }else if(dv.type == 'full'){
            var subRectGroup = this.getSubRectGroup(dRect.copy(),dv);
            for(var i = 0 ; i < subRectGroup.length ; i ++){
                var subRect = subRectGroup[i];
                var subDivider = dv.children[i];
                this.createDivider(subRect,subDivider);
            }
        }
    }
}

var FancyBox = function(){
    this.faces = [];
}
FancyBox.prototype = {
    create:function(){
        minX = (width - 200) / 2.0
        minY = (height - 200) / 2.0
        maxX = width - minX;
        maxY = height - minY;
        var m1 = new RectManager(new Divider('full',2,0.5,0.5));
        m1.createDivider(new MotionRect(new Vec2d(minX,minY),new Vec2d(maxX,maxY),201))
        
        var m2 = new RectManager(new Divider('full',2,0.5,0.5))
        m2.createDivider(new MotionRect(new Vec2d(minX,minY),new Vec2d(maxX,maxY),202))
        
        var m3 = new RectManager(new Divider('full',2,0.5,0.5))
        m3.createDivider(new MotionRect(new Vec2d(minX,minY),new Vec2d(maxX,maxY),203))
    
        var m4 = new RectManager(new Divider('full',2,0.5,0.5))
        m4.createDivider(new MotionRect(new Vec2d(minX,minY),new Vec2d(maxX,maxY),204))
        
        var m5 = new RectManager(new Divider('full',2,0.5,0.5))
        m5.createDivider(new MotionRect(new Vec2d(minX,minY),new Vec2d(maxX,maxY),205))
        
        var m6 = new RectManager(new Divider('full',2,0.5,0.5))
        m6.createDivider(new MotionRect(new Vec2d(minX,minY),new Vec2d(maxX,maxY),206))
        this.faces = [m1,m2,m3,m4,m5,m6]
    },
    display:function(current){
        var self = this;
        var m1 = self.faces[0]
        var m2 = self.faces[1]
        var m3 = self.faces[2]
        var m4 = self.faces[3]
        var m5 = self.faces[4]
        var m6 = self.faces[5]
        var angle = millis() % 24000 / 24000.0 * TAU
        var r = 100
        push()
        rectMode(CORNERS)
        strokeWeight(3)
        translate(0,0,-1000)
        rotateX(angle)
        rotateY(angle)
        fill(255,255,255,255)
        push()
        rotateX(angle * 10)
        rotateY(angle * 5)
        fill(map(sin(millis() / 12000.0 * TAU),-1,1,0,255),map(cos(millis()  / 12000.0 * TAU),-1,1,0,255),map(sin(millis()  / 12000.0 * TAU),-1,1,255,0))
        box(map(sin(millis()  / 10000.0 * TAU),-1,1,50,100))
        pop()
        push()
        translate(-width / 2,-height / 2,r)
        m1.display(current)
        pop()
        
        push()
        rotateX(TAU / 2)
        translate(-width / 2,-height / 2,r)
        m2.display(current)
        pop()
        push()
        rotateX(TAU / 2)
        rotateY(TAU / 4)
        translate(-width / 2,-height / 2,r)
        m3.display(current)
        pop()
        
        push()
        rotateX(TAU / 2)
        rotateY(TAU / 4 + TAU / 2)
        translate(-width / 2,-height / 2,r)
        m4.display(current)
        pop()
        
        push()
        rotateX(TAU / 4)
        translate(-width / 2,-height / 2,r)
        m5.display(current)
        pop()
        
        push()
        rotateX(TAU / 4 + TAU / 2)
        translate(-width / 2,-height / 2,r)
        m6.display(current)
        pop()
        
        pop()
    }
}