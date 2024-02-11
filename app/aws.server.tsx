import { SecretsManagerClient, GetSecretValueCommand  } from "@aws-sdk/client-secrets-manager";
import { AWS_SECRET_ID } from "~/utils/enviroment.server";

declare global {
    var BASIC_AUTH_VALUE: string;
    var WEB_VERSION: string;
}

const initiateSecreteManager = () => {
    if (global.BASIC_AUTH_VALUE) return;
    global.WEB_VERSION = `r-${(new Date()).toDateString()}`;
    try {
        const secretManager = new SecretsManagerClient({region: 'us-east-1',});
        const command = new GetSecretValueCommand({ SecretId : AWS_SECRET_ID });
        secretManager.send(command, (err, data) => {
            if (err || !data?.SecretString) {
                console.log("Unable to get secret manager keys", err);
            } else {
                const secretes = JSON.parse(data.SecretString);
                if (secretes?.password) {
                    global.BASIC_AUTH_VALUE = secretes.password;
                } else {
                    console.log("Couldn't get CORE secret key from aws");
                }
            }
        });
    } catch(err) {
        console.log("Unhandled secrets manger error", err)
    }
}

export { initiateSecreteManager };