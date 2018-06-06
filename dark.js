var testArg = {
    width : null,
    height : null,
    radius : null,
    num : null,

};
function DarkHole(arg){
    arg = arg || testArg;
    this.canvasWidth = arg.width;
    this.canvasHeight = arg.height;
    this.radius = arg.radius;
    this.pNum = arg.num;

    this.init();
}
DarkHole.prototype = {
    init : function(){
        this.domElement = document.createElement("canvas");
        this.domElement.width = this.canvasWidth;
        this.domElement.height = this.canvasHeight;
        this.gl = getWebGLContext(this.domElement);

        this.shaderProgram = createProgram(this.gl, vShader2, fShader, ["oPos"]);
        
        this.gl.useProgram(this.shaderProgram);


        this.initBuffer();
        this.initUniform();

        this.gl.clearColor(0.05, 0.05, 0.05, 1);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    },
    initBuffer : function(){


        var posBufferA = this.gl.createBuffer(),
        posBufferB = this.gl.createBuffer(),
        arr = [],
        height = 1.0,
        radius = this.radius/this.canvasHeight*2,
        width = height*this.canvasHeight/this.canvasWidth,
        deg = 2*Math.PI/this.pNum,
        loc = this.gl.getAttribLocation(this.shaderProgram, "aPos"),
        i = 0;

        // create buffer data
        for(var i = 0; i < this.pNum*4; i+=4){ // x y health 
            arr[i] = radius * Math.sin(i/4*deg) * width;
            arr[i+1] = radius * Math.cos(i/4*deg) * height;
            arr[i+2] = Math.random()*50;
            arr[i+3] = i/4*deg;
        }
        //console.log(arr);

        // init buffer
        this.gl.enableVertexAttribArray(loc);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, posBufferA);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(arr), this.gl.DYNAMIC_COPY);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, posBufferB);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.pNum*4*4, this.gl.DYNAMIC_COPY);

        // init feedback
        this.feedback = this.gl.createTransformFeedback();
        this.gl.bindTransformFeedback(this.gl.TRANSFORM_FEEDBACK, this.feedback);

        // unbind
        //this.gl.bindVertexArray(null);

        this.loc = loc;
        this.posBufferA = posBufferA;
        this.posBufferB = posBufferB;
    },
    initUniform : function(){
        var that = this;
        this.uniforms = {}
        this.uniforms.time = this.gl.getUniformLocation(this.shaderProgram, "time");
        this.uniforms.hpw = this.gl.getUniformLocation(this.shaderProgram, "hpw");
        this.gl.uniform1f(this.uniforms.hpw, this.canvasHeight/this.canvasWidth);

        this.uniforms.radius = this.gl.getUniformLocation(this.shaderProgram, "radius");
        this.gl.uniform1f(this.uniforms.radius, this.radius/this.canvasHeight*2);
        
    },
    update : function(time){
        time = time/1000.0;
        this.gl.uniform1f(this.uniforms.time, time);
    },
    render : function(time){
        this.update(time);

        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.posBufferA);
        this.gl.vertexAttribPointer(this.loc, 4, this.gl.FLOAT, false, 0, 0);
        this.gl.bindBufferBase(this.gl.TRANSFORM_FEEDBACK_BUFFER, 0, this.posBufferB);

        this.gl.beginTransformFeedback(this.gl.POINTS);
        this.gl.drawArrays(this.gl.POINTS, 0, this.pNum);
        this.gl.endTransformFeedback();

        this.gl.bindBufferBase(this.gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);

        var t = this.posBufferA;
        this.posBufferA = this.posBufferB;
        this.posBufferB = t;
    },
    DOM : function(){
        return this.domElement;
    },
    start : function(){
        var that = this;
        function loop(time){
            that.render(time);
            requestAnimationFrame(loop);
        }
        that.animID = requestAnimationFrame(loop);
        
    },
    stop : function(){
        if(this.animID){
            cancelAnimationFrame(this.animID);
        }
    }

}