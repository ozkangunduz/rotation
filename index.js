const canvas = document.getElementById("canvas")
canvas.width = 500
canvas.height=canvas.width
const ctx = canvas.getContext("2d")
var squareSize = 3 // 3 x 3

valueArray =[]

document.addEventListener("keydown", (e)=>{
        valueArray.forEach(element => {
            element.x=element.destination[0]
            element.y=element.destination[1]
        });
        if(!solved){
            if(e.keyCode==32){init()}
            if(e.keyCode==37){rectangle.drawRectangle("left")}
            if(e.keyCode==38){rectangle.drawRectangle("up")}
            if(e.keyCode==39){rectangle.drawRectangle("right")}
            if(e.keyCode==40){rectangle.drawRectangle("down")}
            if(e.keyCode==65){rotateNumbers("left")}    // a : rotateleft
            if(e.keyCode==83){rotateNumbers("right")}    // s : rotateright   
}})

class Value{
    constructor(val, x, y, index){
        this.val = val
        this.x = x
        this.y = y
        this.speed=4
        this.index = index
        this.active = 0 // if in the square 1,2,3,4
        this.destination = [this.x,this.y]
    }
    update(){
        if(this.destination[0]>this.x){this.x+=this.speed}
        if(this.destination[0]<this.x){this.x-=this.speed}
        if(this.destination[1]>this.y){this.y+=this.speed}
        if(this.destination[1]<this.y){this.y-=this.speed}
        
        if(this.destination[0]<this.x+2*this.speed && this.destination[0]>this.x-2*this.speed){
            if(this.destination[1]<this.y+2*this.speed && this.destination[1]>this.y-2*this.speed){
                this.x = this.destination[0]
                this.y = this.destination[1]
            }
        }
        

        this.show()
    }
    show(){
        if(this.active>0){ctx.fillStyle="green"}
        else{ctx.fillStyle="black"}
        ctx.fillText(this.val,this.x,this.y)
    }

}
class Rectangle{
    constructor(){
        this.width=100
        this.height = 100
        this.color ="red"
        this.position =[0,0]
        this.defaultLeft = canvas.width/(squareSize*10) 
        this.left = this.defaultLeft
        this.top = this.left
        this.width = canvas.width*2/squareSize - 2*this.defaultLeft
        this.height = canvas.width*2/squareSize - 2*this.defaultLeft
        
    }
    drawRectangle(direction=""){
        switch(direction){
            case "up":
                this.position[0] -=1
                if(this.position[0]<0){this.position[0]=0}
                break;
            case "down":
                this.position[0]+=1
                if(this.position[0]>=squareSize-1){this.position[0]=squareSize-2}
                break;
            case "left":
                this.position[1]-=1
                if(this.position[1]<0){this.position[1]=0}
                break;
            case "right":
                this.position[1]+=1
                if(this.position[1]>=squareSize-1){this.position[1]=squareSize-2}
                break;
        }

        this.left = this.defaultLeft + this.position[1]*(canvas.width/squareSize)
        this.top = this.defaultLeft + this.position[0]*(canvas.width/squareSize)
        ctx.strokeStyle="red"    
        ctx.rect(this.left,this.top,this.width,this.height);
        ctx.stroke();
        valueArray.forEach(element => {
            if(element.index[0]==this.position[0] && element.index[1]==this.position[1] ){
                element.active=1;
            }else if(element.index[0]==this.position[0] && element.index[1]==this.position[1]+1 ){
                element.active=2;
            }else if(element.index[0]==this.position[0]+1 && element.index[1]==this.position[1] ){
                element.active=3;
            }else if(element.index[0]==this.position[0]+1 && element.index[1]==this.position[1]+1 ){
                element.active=4;
            }else{
                element.active=0
            }
            
        });

    }
}
function init(){
    squareSize = document.getElementById("number").value
    if(squareSize<3){squareSize=3;document.getElementById("number").value =3}
    window.values = []
    window.matrix = []
    window.firstTime = new Date()
    window.moveCount = 0
    window.solved = false
    ctx.font=canvas.width*.7/squareSize + "px Arial"
    ctx.textAlign="center"
    valueArray =[]
    for(let i=1;i<=squareSize*squareSize;i++){values.push(i)}
    values.sort(() => Math.random() - 0.5) // shuffled the values
    for (let i=0;i<squareSize;i++){
        for(let j=0;j<squareSize;j++){
            val = values[i*squareSize+j]
            x = Math.floor(canvas.width/squareSize)*(j)+canvas.width/squareSize/2
            y = Math.floor(canvas.height/squareSize)*(i)+canvas.height/squareSize/2+canvas.width/5/squareSize
            valueArray.push(new Value(val,x,y,[i,j]))
        }
    }
    window.rectangle = new Rectangle();
    
}
function showValues(){
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
    ctx.fillStyle = "black"
    valueArray.forEach(element => {
        element.update();
    });
    rectangle.drawRectangle();
    solved = isSolved()
    if(!solved){
        now = new Date()
        millisecond =  now - firstTime
    }
    document.getElementById("time").innerHTML = "Time : " + Math.floor(millisecond) + " ms,  " + " Moves:" + moveCount  
    if(solved){congratulations()}
}
 function rotateNumbers(side){
    moveCount++
    valueArray.forEach(element => {
        if (element.active==1){a = element}
        if (element.active==2){b = element}
        if (element.active==3){c = element}
        if (element.active==4){d = element}
    });
    if(side=="left"){
        a.destination = [c.x,c.y]
        b.destination = [a.x,a.y]
        c.destination = [d.x,d.y]
        d.destination = [b.x,b.y]
        a.index[0]++
        b.index[1]--
        c.index[1]++
        d.index[0]--
    }else if(side=="right"){
        a.destination = [b.x,b.y]
        b.destination = [d.x,d.y]
        c.destination = [a.x,a.y]
        d.destination = [c.x,c.y]
        a.index[1]++
        b.index[0]++
        c.index[0]--
        d.index[1]--
    }
    
 }
function isSolved(){
    error = false
    valueArray.forEach(element => {
        val1 = element.index[0]*squareSize + 1 + element.index[1]
        val2 = element.val 
        if(val1!=val2){error=true}
    });
    if(error){return false}
    else{return true}


    
}


function congratulations(){
    a = ctx.font
    ctx.font="40px Arial"
    ctx.fillStyle="green"
    ctx.fillRect(70,canvas.height/2-50,canvas.width-130,110)
    ctx.fillStyle="white"
    ctx.fillRect(72,canvas.height/2-48,canvas.width-135,105)
    ctx.fillStyle="black"
    ctx.fillText("Congratulations!", canvas.width/2, canvas.height/2)
    ctx.font = "20px Arial"
    ctx.fillText(millisecond + " milis and " + moveCount + " moves!", canvas.width/2, canvas.height/2+35)
    ctx.font=a
}
init()
setInterval(showValues,1)


