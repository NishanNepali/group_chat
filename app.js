$(function () {
    const socket = io();
    let username = getCookie("username");

    if (!username) {
        // If the username cookie is not available, prompt the user for a username
        username = prompt("Enter your username:");
        if (username) {
            setCookie("username", username);
        } else {
            // Handle the case where the user cancels or enters an empty username
            alert("Username is required. Please refresh and enter a valid username.");
            return;
        }
    }

    $('form').submit(function () {
        const message = $('#input').val();
        if (message.trim() !== '') {
            socket.emit('chat message', { user: username, message });
            $('#input').val('');
        }
        return false;
    });

    socket.on('chat message', function (data) {
        displayMessage(data);
    });

    function displayMessage(data) {
        const { user, message } = data;
        const messageContainer = $('<li>').addClass('message');
        const userElement = $('<span>').addClass('user').text(user);
        const messageElement = $('<span>').text(message);

        messageContainer.append(userElement, messageElement);

        if (user === username) {
            messageContainer.addClass('right');
        }

        $('#messages').append(messageContainer);
        $('#messages').scrollTop($('#messages')[0].scrollHeight);
    }

    // Function to set a cookie
    function setCookie(name, value, days = 7) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    // Function to get a cookie
    function getCookie(name) {
        const cookieName = name + "=";
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.indexOf(cookieName) === 0) {
                return cookie.substring(cookieName.length, cookie.length);
            }
        }
        return null;
    }
});
