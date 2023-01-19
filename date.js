exports.getDate  = function(){
var option = {
    weekday:"long",
    day : "numeric",
    month:"long",
    year:"numeric"
  }
  var today = new Date();
  return today.toLocaleDateString("en-US",option);
}
