$.ajax({
    url: '/userCookie/',
    type: 'POST',
    data: {},
    success: data => {
        let uid = data;
        $.ajax({
            url: '/userData/',
            type: 'POST',
            data: {'uid': uid},
            success: data => {
                $("#input-username").val(data.username);
                $("#input-email").val(data.email);
                $("#input-first-name").val(data.prenom);
                $("#input-last-name").val(data.nom);
                $("#input-address").val(data.adresse);
                $("#input-city").val(data.ville);
                $("#input-country").val(data.pays);
                $("#input-postal-code").val(data.code_postal);
                $("#input-about").val(data.about)
            }
         });
    }
 });