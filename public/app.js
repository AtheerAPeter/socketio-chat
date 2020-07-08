$(function () {
  var socket = io.connect();
  var $messageForm = $("#messageForm");
  var $message = $("#message");
  var $chat = $("#chat");
  var $userFormArea = $("#userFormArea");
  var $userForm = $("#userForm");
  var $messageArea = $("#messageArea");
  var $username = $("#username");
  var $users = $("#users");
  $messageForm.submit(function (e) {
    e.preventDefault();
    console.log("submitted");
    socket.emit("send message", $message.val());
    $message.val("");
    $message.focus();
  });
  socket.on("new message", function (data) {
    if (data.user == localStorage.getItem("username")) {
      $chat.append(
        '<div class="well mymessage" id="newmessage"><strong>' +
          data.user +
          ": </strong>" +
          data.msg +
          "</div>"
      );
    } else {
      $chat.append(
        '<div class="well" id="newmessage"><strong>' +
          data.user +
          ": </strong>" +
          data.msg +
          "</div>"
      );
    }
    updateScroll();
  });

  $userForm.submit(function (e) {
    e.preventDefault();
    console.log("submitted");
    localStorage.setItem("username", $username.val());
    console.log($username.val());
    socket.emit("new user", $username.val(), function (data) {
      if (data) {
        $userFormArea.hide();
        $messageArea.css("display", "flex");
      }
    });
    $username.val("");
  });

  socket.on("get users", function (data) {
    var html = "";
    for (i = 0; i < data.length; i++) {
      html += '<li class="list-group-item">' + data[i] + "</li>";
    }
    $users.html(html);
  });
});
function updateScroll() {
  var element = document.getElementById("chat");
  element.scrollTop = element.scrollHeight;
}
