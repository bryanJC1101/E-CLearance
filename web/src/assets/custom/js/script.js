$(function() {
  $("#combobox").combobox();
  $("#toggle").on("click", function() {
    $("#combobox").toggle();
  });
});
