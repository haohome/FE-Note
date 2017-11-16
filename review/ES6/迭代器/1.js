// 1.forEach迭代器

		// forEach方法接收一个函数作为参数，对数组中每个元素使用这个函数，
		// 只调用这个函数，数组本身没有任何变化


// 2.every迭代器

	// every方法接受一个返回值为布尔类型的函数，对数组中的每个元素使用这个函数，如果对于所有的元素，该函数均返回true，
	// 则该方法返回true，否则返回false



// 3.some迭代器

	// some方法也是接受一个返回值为布尔类型的函数，只要有一个元素使得该函数返回true，该方法就返回true




// 4.reduce迭代器

	//  reduce方法接受一个函数，返回一个值，该方法从一个累加值开始，
	// 不断对累加值和数组中的后续元素调用该函数，知道数组中最后一个元素，最后得到返回的累加值

//reduce迭代器
function add(runningTotal, currentValue){
    return runningTotal + currentValue;
}
var nums = [1,2,3,4,5,6,7,8,9,10];
var sum = nums.reduce(add);
document.write(sum);


//  5.map迭代器

	// map迭代器和forEach有些类似，但是map会改变数组，生成新的数组，如下代码

function curve(grade){
    return grade+5;
}
var grades = [77,65,81,92,83];
var newgrades = grades.map(curve);
document.write(newgrades);



// 6.fiter迭代器

	// 和every迭代器类似，传入一个返回值为布尔类型的函数，和every方法不同的是，当数组中所有元素对应该函数返回的结果均为true时，该方法并不返回true，而是返回一个新的数组，
	// 该数组包含对应函数返回结果为true的元素，代码如下


// http://www.cnblogs.com/tylerdonet/p/5774748.html


