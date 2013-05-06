// Method that pushes paradata
function pushParadata(verb, object, success, failure) {
  $.ajax({
    type : "POST",
    dataType : 'json',
    url  : "/browser/paradata",
    data : { verb : verb, object : object },
    success : function(xhr) {
      success;
    },
    error : function(xhr, txtStatus, errThrown) {
      failure;
    }
  });
}
