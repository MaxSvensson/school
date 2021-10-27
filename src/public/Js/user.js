function onSignIn(googleUser) {
    fetch(`http://localhost:3000/user/login/${googleUser.getAuthResponse().id_token}`, {
        method: 'POST', 
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
        },
    //   body: JSON.stringify(googleUser) // body data type must match "Content-Type" header
    }).then(() => console.log("success")).catch((e) => console.log(e))
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}