/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

/*
 * This application has 6 basic steps:
 * 1. Select an identity from a wallet
 * 2. Connect to network gateway
 * 3. Access PaperNet network
 * 4. Construct request to issue commercial paper
 * 5. Submit transaction
 * 6. Process response
 */

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { Wallets, Gateway } = require('fabric-network');
const path = require('path');

// Main program function
async function main() {

    // A wallet stores a collection of identities for use
    //const wallet = await Wallets.newFileSystemWallet('../identity/user/producer-user/wallet');
        const walletPath = path.join(process.cwd(), 'identity/user/hospital1-user/wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);


    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();

    // Main try/catch block
    try {

        // Specify userName for network access
        // const userName = 'isabella.issuer@magnetocorp.com';
        const userName = 'hospital1-user';

        // Load connection profile; will be used to locate a gateway
        const ccpPath = path.resolve(__dirname, '..', 'connections', 'connection-hospital1.yaml');
        let connectionProfile = yaml.safeLoad(fs.readFileSync(ccpPath, 'utf8'));


        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled:true, asLocalhost: true }
        };
        

        // Connect to gateway using application specified parameters
        console.log('Connect to Fabric gateway.');

        await gateway.connect(connectionProfile, connectionOptions);

        // Access PaperNet network
        console.log('Use network channel: ehrchannel.');

        const network = await gateway.getNetwork('ehrchannel');

        // Get addressability to commercial paper contract
        //console.log('Use org.papernet.commercialpaper smart contract.');

        const contract = await network.getContract('ehr-contract');

        // issue commercial paper
        console.log('Adding Patient EHR...');
        let doctorId = 10;
        let patientId = 1;
        
        const res = await contract.evaluateTransaction('viewDocDetails', doctorId.toString(), patientId.toString());
        if(res.toString() === 'present') {
            let disease = 'Chest pain';
            let report = 'ECG';
            let prescription = 'Ecosprin';
            const issueResponse = await contract.submitTransaction('updateEHR', patientId.toString(),disease.toString(),report.toString(),prescription.toString());
            console.log('Transaction complete.' + issueResponse);
        }
        else{
            console.log("No Access to this Patient's EHR..\n Please request the patient to get access.");
        }

        // process response
        

    } catch (error) {

        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);

    } finally {

        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();

    }
}
main().then(() => {

    console.log('Add Tuna program complete.');

}).catch((e) => {

    console.log('Add Tuna program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);

});
