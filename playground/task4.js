const _ = require('lodash');

// 1. _.chunk(array, [size=1]) Створює масив елементів, розбитий на групи довжиною size. Якщо масив не може бути розбитий рівномірно, то в кінцевий шматок будуть складені елементи, що залишилися.
// 2. _.compact(array) Створює масив, з якого видаляються всі хибні значення. Значення false, null, 0, "", undefined та NaN є хибними.
// 3. _.concat(array, [values]) Створює новий масив, конкатенуючи масив з будь-якими додатковими масивами та/або значеннями.
// 4. _.difference(array, [values]) Створює масив значень масиву, що не входять до інших заданих масивів, використовуючи SameValueZero для порівняння на рівність. Порядок та посилання на значення результату визначаються першим масивом.
// 5. _.drop(array, [n=1]) Створює фрагмент масиву з n елементами, відкинутими з початку.

 
const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const chunk = _.chunk(array, 3);
const compact = _.compact(array);
const concat = _.concat(array, 11, 12, 13);
const difference = _.difference(array, [1, 2, 3, 4, 5]);
const drop = _.drop(array, 3);

console.log(chunk);
console.log(compact);
console.log(concat);
console.log(difference);
console.log(drop);



