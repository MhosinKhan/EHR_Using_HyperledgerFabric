/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 *  SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const { Wallets } = require('fabric-network');
const path = require('path');

const fixtures = path.resolve(__dirname, '../');

async function main() {

    // Main try/catch block
    try {
        // A wallet stores a collection of identities
        const args = process.argv.slice(2);
        const org = args[0];
        const wallet = await Wallets.newFileSystemWallet(`identity/user/${org}-user/wallet`);

        // Identity to credentials to be stored in the wallet
        const credPath = path.join(fixtures, `crypto-config/peerOrganizations/${org}.example.com/users/User1@${org}.example.com`);
        const certificate = fs.readFileSync(path.join(credPath, `/msp/signcerts/User1@${org}.example.com-cert.pem`)).toString();
        const privateKey = fs.readFileSync(path.join(credPath, '/msp/keystore/priv_sk')).toString();

        // Load credentials into wallet
        const identityLabel = `${org}-user`;
        const upper = org.replace(/^\w/, c => c.toUpperCase());
        const identity = {
            credentials: {
                certificate,
                privateKey
            },
            mspId: `${upper}MSP`,
            type: 'X.509'
        }


        await wallet.put(identityLabel,identity);
        console.log("Added successfully");

    } catch (error) {
        console.log(`Error adding to wallet. ${error}`);
        console.log(error.stack);
    }
}

main().then(() => {
    console.log('done');
}).catch((e) => {
    console.log(e);
    console.log(e.stack);
    process.exit(-1);
});
