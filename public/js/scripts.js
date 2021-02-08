function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1])
        });
    return result;
}

let registerErrors = ["Les mots de passes ne correspondent pas.", "L'adresse email entrée est déjà utilisé."]


if(findGetParameter("error") != null)
{
    if(window.location.href.includes("register"))
    {
        let number = findGetParameter("error");
        let message = registerErrors[parseInt(number)-1];
        $('.page-message').text(message);
        $('.page-message').css('backgroundColor', 'red');
        window.history.pushState("", "", '/register/');
    }
    else if(window.location.href.includes("login"))
    {
        $('.page-message').text("L'email ou mot de passe est incorrect.");
        $('.page-message').css('backgroundColor', 'red');
        window.history.pushState("", "", '/login/');
    }
}
else if(findGetParameter("success") != null)
{
    if(window.location.href.includes("login"))
    {
        $('.page-message').text("Inscription réussi !");
        $('.page-message').css('backgroundColor', 'green');
        window.history.pushState("", "", '/login/');
    }
}