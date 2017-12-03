$(document).ready(function() {

  var userDiv = $("#user_tree").parent();
  var sysDiv = $("#system_tree").parent();
  $("#userHeader").click(function() {
    if (userDiv.css("display") == "none") {
      userDiv.slideDown();
      $("#userHeader >i").addClass("iconOpened");
      $("#userHeader >i").removeClass("iconClosed");
    } else {
      userDiv.slideUp();
      $("#userHeader >i").addClass("iconClosed");
      $("#userHeader >i").removeClass("iconOpened");
    }
  });

  $("#sysHeader").click(function() {
    if (sysDiv.css("display") == "none") {
      sysDiv.slideDown();
      $("#sysHeader >i").addClass("iconOpened");
      $("#sysHeader >i").removeClass("iconClosed");
    } else {
      sysDiv.slideUp();
      $("#sysHeader >i").addClass("iconClosed");
      $("#sysHeader >i").removeClass("iconOpened");
    }

  });
});