
require('./js/code/part2_exercises/support.js');
var Task = require('data.task');
var _ = require('ramda');

// Exercise 1
// ==========
// Use _.add(x,y) and map(f,x) to make a function that increments a value inside a functor


var ex1 = _.map(_.add(1));
console.log(ex1(Maybe.of(1)));

//练习 2
// ==========
// 使用 _.head 获取列表的第一个元素

var xs = Identity.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do']);
var ex2 = _.map(_.head);

console.log(ex2(xs));

// 练习 3
// ==========
// 使用 safeProp 和 _.head 找到 user 的名字的首字母

var safeProp = _.curry(function (x, o) { 
	return Maybe.of(o[x]);
});
var user = { id: 2, name: "Albert" };
var ex3 = _.compose(_.map(_.head), safeProp('name'));

console.log(ex3(user));



// 练习 4
// ==========
// 使用 Maybe 重写 ex4，不要有 if 语句

/*
var _ex4 = function (n) {
  if (n) { return parseInt(n); }
};
*/

var ex4 = _.map(parseInt);
var _ex4 = _.compose(_.map(parseInt),Maybe.of);

console.log(ex4(Maybe.of(NaN)));
console.log(ex4(Maybe.of(1)));
console.log(ex4(Maybe.of("abac")));
console.log(ex4(Maybe.of("0abac")));
console.log(ex4(Maybe.of(null)));


console.log(_ex4("abac"));
console.log(_ex4("0abac"));
console.log(_ex4(null));

var ex4 = _.map(parseInt);


// Exercise 5
// ==========
// Write a function that will getPost then toUpperCase the post's title

// getPost :: Int -> Task({id: Int, title: String})
var getPost = function (i) {
  return new Task(function(rej, res) {
    setTimeout(function(){
      res({id: i, title: 'Love them futures'})  
    }, 300)
  });
};

var upperTitle = _.compose(toUpperCase, _.prop('title'));
var ex5 = _.compose(_.map(upperTitle), getPost);



// Exercise 6
// ==========
// Write a function that uses checkActive() and showWelcome() to grant access or return the error

var showWelcome = _.compose(_.concat( "Welcome "), _.prop('name'))

var checkActive = function(user) {
 return user.active ? Right.of(user) : Left.of('Your account is not active')
}

var ex6 = _.compose(_.map(showWelcome), checkActive)



// Exercise 7
// ==========
// Write a validation function that checks for a length > 3. It should return Right(x) if it is greater than 3 and Left("You need > 3") otherwise

var ex7 = function(x) {
  return x.length > 3 ? Right.of(x) : Left.of("You need > 3");
}


console.log("ex7");
console.log(ex7("ddffd"));
console.log(ex7("a"));



// Exercise 8
// ==========
// Use ex7 above and Either as a functor to save the user if they are valid or return the error message string. Remember either's two arguments must return the same type.

var save = function(x){
  return new IO(function(){
    console.log("SAVED USER!");
    return x + '-saved';
  });
}

//either會判斷 save ex7回傳的物件type是 left or right
//如果是left 則直接報行 ex7 的輸出(Left.of("You need > 3"))
//如果是Right則執行 save
var ex8 = _.compose(either(IO.of, save), ex7)
var saveString1 = ex8("ddffd"); //定義了參數，卻可以不用馬上報行
var saveString2 = ex8("d");
console.log("ex8");
console.log(saveString1.unsafePerformIO());
console.log(saveString2.unsafePerformIO());


//作到這邊對於of好像有一種新的感覺，他即擔任將容器傳給下一個算子的角色
//也擔任輸出物件/法方的角色

/*IO.of(Left.of("You need > 3")) -> 
	return new IO(function() {
		return Left.of("You need > 3");
	});
 ->
//Left.of("You need > 3") - > 
	return new Left("You need > 3");
-> Left {_value:"You need > 3"}
*/

//要把of視為打包的方法，他會回傳一個含有你傳進去的東西的物件 也許是方法 也許是一個值