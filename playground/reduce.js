var mapped = [
  [2016, "October", "Monday", {a:1}],
  [2017, "January", "Friday", {a:1}],
  [2017, "January", "Wednesday", {a:2}],
  [2017, "October", "Monday", {a:1}],
  [2019, "October", "Monday", {a:1}]
];

// const result = mapped.reduce( (acc, [year, month, day, object]) => {
//   console.log('Before');
//   console.log(acc);
//   let curr = acc[year] = acc[year] || {};
// 	curr = curr[month] = curr[month] || {};
// 	// curr = curr[day] = curr[day] || [];
// 	// curr.push(object);
//   console.log('After');
//   console.log(curr);
// 	return acc;
// }, {});
const result = {};
mapped.forEach(([year, month, day, object]) => {
  let reference = result[year] = result[year] || {};
  	reference = reference[month] = reference[month] || {};
  	reference = reference[day] = reference[day] || [];
  	reference.push(object);
});

console.log(result);
