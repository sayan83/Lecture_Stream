console.log('hello')

async function login() {
	const username = document.getElementById('username').value;
	const password = document.getElementById('password').value;
    //VERIFY USERNAME AND PASSWORDS
    try {
    	const data = JSON.stringify({
			email: username,
			password: password
		})
        const attemptLogin = await fetch("http://localhost:3000/api/user/login", { 
		    method: "POST", 
		    body: data,
		    headers: {
		    	// 'Access-Control-Allow-Credentials': true,
			    'Content-Type': 'application/json',
			    'Content-Length': data.length
			},
			credentials: 'include', 
		});

		console.log(attemptLogin.headers) 

		if(attemptLogin.status === 401)
			alert("Invalid Credentials");
		else if(attemptLogin.status === 403)
			alert("Only 1 session support per user! Log out from previous session or contact admin");
		else {
			const accessToken = await attemptLogin.json();
			console.log(accessToken);
			localStorage.setItem(
				'AccessToken', accessToken.AccessToken,
			);

			window.location.href = '/stream';
		}

        // if(logined.ChallengeName = 'NEW_PASSWORD_REQUIRED') {
        //     document.getElementById('newPassword').style.display = "block";
        //     document.getElementById('submitNewPassword').style.display = "block";
        //     document.getElementById('newPasswordInstructions').style.display = "block";
        //     initAuthSession = logined.Session;
        // }
        // else {
        //     console.log('Logged in');
        //     //Manage tokens

        //     window.location.href = "/stream";
        // }
    } catch (err) {
        alert("Error occured!");
        console.log(err);
    }
}


async function refresh() {
	try {
		const attemptRefresh = await fetch("http://localhost:3000/api/user/token", { 
		    method: "GET", 
			credentials: 'include', 
		});
		if(attemptRefresh.status === 200) {
			const accessToken = await attemptRefresh.json();
			localStorage.setItem('AccessToken',accessToken.AccessToken);
		}
	}catch(err) {
		console.log(err);
	}
}