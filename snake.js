 ;(function()
 {
   class Random
   {

     static get(inicio,final)
     {
       return Math.floor(Math.random()*final) + inicio
     }
   }
   class Food
   {
     constructor(x,y)
     {
       this.x = x;
       this.y = y;
       this.width = 10;
       this.height = 10;
     }
     static generate()
     {
        return new Food(Random.get(0,450),Random.get(0,450))
     }
     draw(){
       lienzo.fillRect(this.x,this.y,this.width,this.height)
     }
   }
   class Square
   {
     constructor(x,y)
     {
      this.x = x;
      this.y = y;
      this.width = 10;
      this.height = 10;

      this.back = null;//cuadrado de atras
     }

     draw()
     {
       lienzo.fillRect(this.x,this.y,10,10);
       if (this.hasBack())
       {
         this.back.draw();
       }
     }
     add()
     {
       if (this.hasBack()) return this.back.add();
       this.back = new Square(this.x,this.y);
     }
     hasBack(){
       return this.back !== null
     }
     copy(){
       if (this.hasBack())
       {
         this.back.copy();
         this.back.x = this.x
         this.back.y = this.y
       }
     }
     right()
     {
       this.copy()
       this.x += 10
     }
     left()
     {
       this.copy()
       this.x -= 10
     }
     top()
     {
       this.copy()
       this.y -= 10
     }
     down()
     {
       this.copy()
       this.y += 10
     }
     hit(head,segundo = false)
     {
       if (this ===  head && !this.hasBack()) return false;
       if(this === head) return this.back.hit(head,true)
       if (segundo && !this.hasBack()) return false;
       if(segundo) return this.back.hit(head)

       if(this.hasBack())
       {
         return squareHit(this,head) || this.back.hit(head)
       }
       return squareHit(this,head)

     }
     hitBorder()
     {
       if (this.x >430 || this.x < 0 || this.y > 430 || this.y < 0)
       {
         return true;
       }
     }
   }
   class Snake
   {
     constructor()
     {
       this.head = new Square(0,0);
       this.direction = "right";
       this.head.add();

       this.draw();
     }
     draw()
     {
       this.head.draw();
     }
     left()
     {
       if(this.direction == "right" ) return;
       this.direction = "left";
     }
     right()
     {
       if(this.direction == "left" ) return;
       this.direction = "right";
     }
     top()
     {
       if(this.direction == "down" ) return;
       this.direction = "top";
     }
     down()
     {
       if(this.direction == "top" ) return;
       this.direction = "down";
     }
     move(){
       if (this.direction === "right" ) return this.head.right();
       if (this.direction === "left" ) return this.head.left();
       if (this.direction === "down" ) return this.head.down();
       if (this.direction === "top" ) return this.head.top();
     }
     eat()
     {
       this.head.add();
     }
     dead()
     {
       return this.head.hit(this.head) || this.head.hitBorder();
     }


   }


   const contenedor = document.getElementById("contenedor");
   const lienzo = contenedor.getContext("2d");
   let foods = [];
   const snake = new Snake;


   const animacion = setInterval(function()
   {
     snake.move();
     lienzo.clearRect(0,0,contenedor.width,contenedor.height);
     snake.draw();
     if(snake.dead())
     {
       console.log("fin del juego");
       window.clearInterval(animacion)
     }
     drawfood();
   },1000/5)

   setInterval(function()
   {
     const food = Food.generate();
     foods.push(food)
     setTimeout(function()
     {
       removeFromFoods(food);
     },10000)


   },4000)

   function drawfood()
   {
     for (const index in foods)
     {
       const food = foods[index]
       
       if(typeof food !== "undefined")
       {
          food.draw();
          if(hit(food,snake.head))
          {
            snake.eat();
            removeFromFoods(food);
          }
       }

     }
   }
   function removeFromFoods(food)
   {
     foods = foods.filter(function(f)
     {
       return food !== f
     })
   }
   function squareHit(cuadrado1,cuadrado2)
   {
     return cuadrado1.x == cuadrado2.x && cuadrado1.y == cuadrado2.y
   }

   function hit(a,b)
   {
       var hit = false;
       if(b.x + b.width >= a.x && b.x < a.x + a.width){
        if(b.y + b.height >= a.y && b.y < a.y + a.height){
         hit=true;
        }
       }
       if(b.x <= a.x && b.x + b.width >= a.x + a.width){
        if(b.y <= a.y && b.y + b.height >= a.y + a.height){
         hit=true;
        }
       }
       if(a.x <=b.x && a.x + a.width >= b.x + b.width){
        if(a.y <= b.y && a.y + a.height >= b.y + b.height){
         hit = true;
        }
       }
       return hit;
     }
   window.addEventListener("keyup",function(evento)
   {
      if (evento.keyCode === 68) return snake.right();
      if (evento.keyCode === 87) return snake.top();
      if (evento.keyCode === 83) return snake.down();
      if (evento.keyCode === 65) return snake.left();

   })

 })();
