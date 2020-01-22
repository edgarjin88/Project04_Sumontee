function greet(num) {
  var reply = [this.animal, 'typically sleep between', this.sleepDuration, num].join(' ');
  console.log(reply);
}

var obj = {
  animal: 'cats', sleepDuration: '12 and 16 hours'
};

greet.call(obj, 33, 34);

