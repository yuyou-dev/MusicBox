
var Vec3d = function(x,y,z){
    this.x = x;
    this.y = y
    this.z = z
}
Vec3d.prototype = {
    copy:function(){
        return new Vec3d(this.x,this.y,this.z)
    },
}
var Vec2d = function(x = 0,y =0){
    this.x = x
    this.y = y
}
var rect2 = function(x1,y1,x2,y2,r){
    ellipseMode(RADIUS);

    noStroke()
    beginShape();
    vertex(x1 + r,y1 + r)
    vertex(x1 + r,y1);
    vertex(x2 - r,y1);
    
    vertex(x2 - r,y1 + r)
    vertex(x2,y1 + r);
    vertex(x2,y2 - r);

    vertex(x2 - r,y2 - r)
    
    vertex(x2 - r,y2);
    vertex(x1 + r,y2);

    vertex(x1 + r,y2 - r)
    
    vertex(x1,y2 - r);
    vertex(x1,y1 + r);

    vertex(x1 + r,y1 + r)
    endShape();
    stroke(0)
    strokeWeight(5);
    arc(x1 + r,y1 + r,r,r,TAU / 2,TAU * 3 / 4);
    arc(x2 - r,y1 + r,r,r,TAU * 3/ 4,TAU);
    arc(x2 - r,y2 - r,r,r,0,TAU / 4)
    arc(x1 + r,y2 - r,r,r,TAU / 4,TAU / 2)

    line(x1 + r,y1,x2 - r,y1);
    line(x2,y1 + r,x2,y2 - r);
    line(x1 + r,y2,x2 - r,y2);
    line(x1,y1 + r,x1,y2 - r);
}
Vec2d.prototype = {
    copy:function(){
        return new Vec2d(this.x,this.y);
    },
    add:function(x,y){
        this.x += x
        this.y += y
    },
    set:function(x,y){
        this.x = x
        this.y = y
    },
    distance:function(v){
        var x1 = this.x;
        var y1 = this.y;
        var x2 = v.x;
        var y2 = v.y;
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }
}
var Line3d = function(p1,p2){
    this.p1 = p1;
    this.p2 = p2;
}
Line3d.prototype = {
    copy:function(){
        return new Line3d(this.p1.copy(),this.p2.copy())
    },
    display:function(){
        line(this.p1.x,this.p1.y,this.p1.z,this.p2.x,this.p2.y,this.p2.z)
    }
}
var Line = function(p1,p2){
    this.p1 = p1;
    this.p2 = p2;
}
Line.prototype = {
    copy:function(){
        return new Line(this.p1.copy(),this.p2.copy())
    },
    lerp:function(){
        var x = lerp(this.p1.x,this.p2.x,s)
        var y = lerp(this.p1.y,this.p2.y,s)
        return new Vec2d(x,y)
    },
    display:function(){
        line(this.p1.x,this.p1.y,this.p2.x,this.p2.y)
    }
}