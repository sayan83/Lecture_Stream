let poolId = 'ap-south-1_Dx7PWS4se';
let clientId = '6m1bcjc07pr6fp5uvgvi5g009g';

let initAuthSession = '';
let myCredentials = new AWS.CognitoIdentityCredentials({ IdentityPoolId: poolId });
let myConfig = new AWS.Config({
    credentials: myCredentials, region: 'ap-south-1'
});

AWS.config.update({
    region: 'ap-south-1',
    // accessKeyId: keyId,
    // secretAccessKey: keySecret
})


const cognito = new AWS.CognitoIdentityServiceProvider()

async function login() {
    //VERIFY USERNAME AND PASSWORDS
    try {
        const logined = await cognito.initiateAuth({
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: clientId,
            // UserPoolId: poolId,
            AuthParameters: {
                USERNAME: 'sayan83',
                PASSWORD: 'somepassword'
            }
        }).promise()
        console.log(logined);

        if(logined.ChallengeName = 'NEW_PASSWORD_REQUIRED') {
            document.getElementById('newPassword').style.display = "block";
            document.getElementById('submitNewPassword').style.display = "block";
            document.getElementById('newPasswordInstructions').style.display = "block";
            initAuthSession = logined.Session;
        }
        else {
            console.log('Logged in');
            //Manage tokens

            window.location.href = "/stream";
        }
    } catch (err) {
        alert("Error occured!");
        console.log(err);
    }
}

async function resetPassword() {
    const newPassword = document.getElementById('newPassword').value;
    const username = document.getElementsByName('username').value;
    console.log(newPassword);
    // VERIFY NEW PASSWORD

    try {
        const challengeResp = await cognito.respondToAuthChallenge({
            ChallengeName: 'NEW_PASSWORD_REQUIRED',
            ClientId: clientId,
            // UserPoolId: poolId,
            ChallengeResponses: {
                USERNAME: 'sayan83',
                NEW_PASSWORD: newPassword,
            },
            Session: initAuthSession
        }).promise()

        console.log(challengeResp);

        if(challengeResp.AuthenticationResult.AccessToken) {
            window.location.href = "/stream";
        }
    }catch(err) {
        alert("Error occured!");
        console.log(err);
    }
}