
  $.getJSON("/articles", function(data) {
    for (var i = 0; i < data.length; i++) {
      $("#articles").prepend("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + "<a href='" + data[i].link + "'>" + "link" + "</a>" + "</p>");
    }
  });

$(document).on("click", "p", function() {

  var thisId = $(this).attr("data-id");


  $.ajax({
    async: true,
    method: "GET",
    url: "/articles/" + thisId
  })
    .done(function(data) {
      $("#notes").empty();
      console.log(data);
      $("#notes").append("<h2>" + data.title + "</h2>");
      $("#notes").append("<input id='titleinput' name='title' >")
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // var path = '/notes/' + $(this).attr("data-id").toString();
      // $.get(path, function(res) {
      // $("#comments").html(res);
      // });
      // if (data.note) {
      //   $("#titleinput").val(data.note.title);
      //   $("#bodyinput").val(data.note.body);
      // }
    });
    // var path = '/notes/' + thisId;
  $.ajax({
    async: true,
    method: "GET",
    url: "/notes/" + thisId
  }).done(function(data){
      $("#comments").empty();
      $("#comments").append(data);
  });
    // $.get(path, function(res) {
    //   $("#comments").empty();
    //   $("#comments").append(res);
    // });
});

$(document).on("click", "#savenote", function() {
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val(),
      articleId: thisId
    }
  })
    .done(function(data) {
      console.log(data);
      $("#notes").empty();
      $("#comments").empty();
    });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});

 // $(document).on("click", "p", function(e) {
 //    var path = '/notes/' + $(this).attr("data-id").toString();
 //    $.get(path, function(res) {
 //      $("#notes").append(res);
 //    });
 //  });

  $(".delete-note-btn").on("click", function(e) {
    e.preventDefault();
    var noteid = $(this).attr("data-id").toString();
    $.ajax({
        url: "/delete-note/" + noteid,
        method: "DELETE",
        success: function(res) {
            console.log(res);
            $("#note-"+noteid).remove();
        }, 
        catch: function(err) {
            console.log(err);
        }
    });
  });