
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(express.static(__dirname+'/public'));
const PDFDocument = require('pdfkit');
app.use(bodyParser.json());
app.set('view engine', 'ejs');
// Setting for Hyperledger Fabric
const { Wallets, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { success } = require('fabric-shim');
var nodemailer = require('nodemailer');


const gateway = new Gateway();

app.use(bodyParser.urlencoded({
    extended: false
  }));
  //app.set('views', 'views');
  app.set('view engine', 'ejs');
  
// CORS Origin
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });

  app.post('/api/addPatient', async function (req, res) {

    try {
            const walletPath = path.join(process.cwd(), 'identity/user/hospital1-user/wallet');
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);


            // A gateway defines the peers used to access Fabric networks
            const gateway = new Gateway();


            // Specify userName for network access
    
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

        
            console.log('Use network channel: ehrchannel.');

            const network = await gateway.getNetwork('ehrchannel');

        

            const contract = await network.getContract('ehr-contract');

            console.log('Adding Patient Details.');
            let patientDetails = {
                patientId: req.body.patientId,
                name: req.body.name,
                phone: req.body.phone,
                emailId: req.body.emailId,
                doctorId: 0,
                doctorName: 'Not Updated',
                hospitalId: 0,
                hospitalName: 'Not Updated',
                disease: 'Not Updated',
                report: 'Not Updated',
                prescription: 'Not Updated'
            }
          
            const tx = await contract.submitTransaction('addPatient', JSON.stringify(patientDetails));
            res.render('success1');
            console.log("Patient Added Successfully");
        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            res.status(500).json({
            error: error
        });
        }
        finally {

            // Disconnect from the gateway
            console.log('Disconnect from Fabric gateway.');
            gateway.disconnect();
    
        }
  
  });

  app.post('/api/addDoctor1', async function (req, res) {

    try {
            const walletPath = path.join(process.cwd(), 'identity/user/hospital1-user/wallet');
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);


            // A gateway defines the peers used to access Fabric networks
            const gateway = new Gateway();


            // Specify userName for network access
    
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

        
            console.log('Use network channel: ehrchannel.');

            const network = await gateway.getNetwork('ehrchannel');

        

            const contract = await network.getContract('ehr-contract');

            let consultId = 'no entries';
            console.log('Adding Doctor Details.');
            let details = {
                doctorId: req.body.doctorId,
                doctorName: req.body.doctorName,
                areaofExpertise: req.body.areaofExpertise,
                hospitalId: req.body.hospitalId,
                hospitalName: req.body.hospitalName,
                consultIds: consultId
              }
          
            const tx = await contract.submitTransaction('addDoctor', JSON.stringify(details));
            res.render('success2');
            console.log("Doctor Added Successfully");
        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            res.status(500).json({
            error: error
        });
        }
        finally {

            // Disconnect from the gateway
            console.log('Disconnect from Fabric gateway.');
            gateway.disconnect();
    
        }
  
  });

  app.post('/api/assignPatient', async function (req, res) {

    try {
            const walletPath = path.join(process.cwd(), 'identity/user/hospital1-user/wallet');
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);


            // A gateway defines the peers used to access Fabric networks
            const gateway = new Gateway();


            // Specify userName for network access
    
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

        
            console.log('Use network channel: ehrchannel.');

            const network = await gateway.getNetwork('ehrchannel');

        

            const contract = await network.getContract('ehr-contract');

            
          
            let tx = await contract.submitTransaction('assignPatToDoc', req.body.doctorId.toString(), req.body.patientId.toString());

            let tx1 = await contract.submitTransaction('editPatientDetails', req.body.patientId.toString(), req.body.doctorId.toString());

        res.render('success3');
        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            res.status(500).json({
            error: error
        });
        }
        finally {

            // Disconnect from the gateway
            console.log('Disconnect from Fabric gateway.');
            gateway.disconnect();
    
        }
  
  });

  app.post('/api/viewEHR', async function (req, res) {

    try {
            const walletPath = path.join(process.cwd(), 'identity/user/hospital1-user/wallet');
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);


            // A gateway defines the peers used to access Fabric networks
            const gateway = new Gateway();


            // Specify userName for network access
    
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

        
            console.log('Use network channel: ehrchannel.');

            const network = await gateway.getNetwork('ehrchannel');

        

            const contract = await network.getContract('ehr-contract');

            const tx = await contract.evaluateTransaction('viewDocDetails', req.body.doctorId.toString(), req.body.patientId.toString());
            if(tx.toString() === 'present') {
                const result = await contract.evaluateTransaction('queryAsset', req.body.patientId.toString());
                let jsonres = result.toString();
                var obj = JSON.parse(jsonres);
                var resObj = [];
                for(var i in obj){
                    resObj.push(obj[i]);
                    
                }
                //console.log(res.toString());
                let pid = 'PatientID                 : ' + resObj[0];
                let pname = 'Patient Name          : ' + resObj[1];
                let doc = 'Doctor                     : ' + resObj[5];
                let hos = 'Hospital                   : ' + resObj[7];
                let dis = 'Disease                   : ' + resObj[8];
                let rep = 'Report                     : ' + resObj[9];
                let pres = 'Prescription             : ' + resObj[10];
                let EHR = pid + "\n" + pname + "\n" + doc + "\n" + hos + "\n" + dis + "\n" + rep + "\n" + pres; 

                let pdfDoc = new PDFDocument;
                pdfDoc.pipe(fs.createWriteStream(`${resObj[0]}_${resObj[1]}.pdf`));
                pdfDoc.text(EHR);
                pdfDoc.end();
                res.render('success4');
                console.log(EHR);
                /*for(let i=0 ; i < temp.length ; i++){

                }*/
            }
        else{
            res.render('alert');
        }
        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            res.status(500).json({
            error: error
        });
        }
        finally {

            // Disconnect from the gateway
            console.log('Disconnect from Fabric gateway.');
            gateway.disconnect();
    
        }
  
  });

  app.post('/api/addEHR', async function (req, res) {

    try {
            const walletPath = path.join(process.cwd(), 'identity/user/hospital1-user/wallet');
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);


            // A gateway defines the peers used to access Fabric networks
            const gateway = new Gateway();


            // Specify userName for network access
    
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

        
            console.log('Use network channel: ehrchannel.');

            const network = await gateway.getNetwork('ehrchannel');

        

            const contract = await network.getContract('ehr-contract');

            const res1 = await contract.evaluateTransaction('viewDocDetails', req.body.doctorId.toString(), req.body.patientId.toString());
        if(res1.toString() === 'present') {
            const issueResponse = await contract.submitTransaction('updateEHR', req.body.patientId.toString(),req.body.disease.toString(),req.body.report.toString(),req.body.prescription.toString());
            res.render('success5');
        }
        else{
            res.render('alert');
        }
        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            res.status(500).json({
            error: error
        });
        }
        finally {

            // Disconnect from the gateway
            console.log('Disconnect from Fabric gateway.');
            gateway.disconnect();
    
        }
  
  });

  app.post('/api/shareEHR', async function (req, res) {

    try {
            const walletPath = path.join(process.cwd(), 'identity/user/hospital1-user/wallet');
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);


            // A gateway defines the peers used to access Fabric networks
            const gateway = new Gateway();


            // Specify userName for network access
    
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

        
            console.log('Use network channel: ehrchannel.');

            const network = await gateway.getNetwork('ehrchannel');

        

            const contract = await network.getContract('ehr-contract');

            const issueResponse = await contract.submitTransaction('shareEHR', req.body.patientId.toString(), req.body.doctorId.toString());
            console.log('EHR Shared'+ issueResponse);
            res.render('success6');
            
        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            res.status(500).json({
            error: error
        });
        }
        finally {

            // Disconnect from the gateway
            console.log('Disconnect from Fabric gateway.');
            gateway.disconnect();
    
        }
  
  });

  app.post('/api/getHistory', async function (req, res) {

    try {
            const walletPath = path.join(process.cwd(), 'identity/user/hospital1-user/wallet');
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);


            // A gateway defines the peers used to access Fabric networks
            const gateway = new Gateway();


            // Specify userName for network access
    
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

        
            console.log('Use network channel: ehrchannel.');

            const network = await gateway.getNetwork('ehrchannel');

        

            const contract = await network.getContract('ehr-contract');

            const result = await contract.evaluateTransaction('getPatientHistory', req.body.patientId.toString());
            
            let jsonres = result.toString();
                var obj = JSON.parse(jsonres);
                var resObj = [];
                let inc = 0;
                for(var i in obj){
                    resObj.push(obj[i]);
                    inc = inc + 1;
                }
            let temp= "Recent EHR\n\n";
            temp = temp + 'PatientID          : ' + resObj[0].patientId + "\nPatient Name   : " + resObj[0].name + "\nMobile No.        : " + resObj[0].phone + "\nEmail ID           : " + resObj[0].emailId + "\nDoctor ID          : " + resObj[0].doctorId + "\nDoctor Name    : " + resObj[0].doctorName + "\nHospital ID        : " + resObj[0].hospitalId + "\nHospital Name  : " + resObj[0].hospitalName + "\nDisease            : " + resObj[0].disease + "\nReport              : " + resObj[0].report + "\nPrescription      : " + resObj[0].prescription;
            let temp1 = "\n\nPrevious Records\n\n";
            for(let i = 1; i < inc ; i++){
                temp1 = temp1 + 'PatientID          : ' + resObj[i].patientId + "\nPatient Name   : " + resObj[i].name + "\nMobile No.        : " + resObj[i].phone + "\nEmail ID           : " + resObj[i].emailId + "\nDoctor ID          : " + resObj[i].doctorId + "\nDoctor Name    : " + resObj[i].doctorName + "\nHospital ID        : " + resObj[i].hospitalId + "\nHospital Name  : " + resObj[i].hospitalName + "\nDisease            : " + resObj[i].disease + "\nReport              : " + resObj[i].report + "\nPrescription      : " + resObj[i].prescription + "\n\n";
            }
            let final = temp + temp1;
            let pdfDoc = new PDFDocument;
                pdfDoc.pipe(fs.createWriteStream(`${resObj[0].patientId}_${resObj[0].name}_Report.pdf`));
                pdfDoc.text(final);
                pdfDoc.end();
            res.render('success8');
                
            
    
        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            res.status(500).json({
            error: error
        });
        }
        finally {

            // Disconnect from the gateway
            console.log('Disconnect from Fabric gateway.');
            gateway.disconnect();
    
        }
  
  });

  //app.use(express.static("public"));

  app.post('/api/emailVerification', async function (req, res) {

    
    try {
        let h1 = req.body.hospitalId.toString();
        let h2 = req.body.emailId.toString();
    
        if(h1.length === 0 || h2.length === 0){
            res.render('alert1');
        }
        else {
            let hospitalOrg = 'blank';
            if(req.body.hospitalId.toString() === '500' ){
                console.log("Cke");
                hospitalOrg = 'hospital1';
            }
            if(req.body.hospitalId.toString === '600'){
                hospitalOrg = 'hospital2';
            }
            const walletPath = path.join(process.cwd(), `identity/user/${hospitalOrg}-user/wallet`);
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);


            // A gateway defines the peers used to access Fabric networks
            const gateway = new Gateway();


            // Specify userName for network access
    
            const userName = `${hospitalOrg}-user`;

            // Load connection profile; will be used to locate a gateway
            const ccpPath = path.resolve(__dirname, '..', 'connections', `connection-${hospitalOrg}.yaml`);
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

        
            console.log('Use network channel: ehrchannel.');

            const network = await gateway.getNetwork('ehrchannel');

        

            const contract = await network.getContract('ehr-contract');

            const tx = await contract.evaluateTransaction('getAdminEmail', req.body.hospitalId.toString());
            if(tx.toString() === 'no') {
               res.render('alert2');
            }
        else{
            if(tx.toString() === req.body.emailId.toString()){
                //res.render('login');
                //const walletPath = path.join(process.cwd(), 'ehr-app/public');
                //res.sendFile('addDoctor.html');
                //console.log("File: "+__dirname);
                //res.sendFile(path.join(__dirname + "/addDoctor.html"));
                console.log(req.url);
                res.sendFile(path.join(__dirname,"public","addDoctor.html"));
                
            }
            else{
                res.render('alert3');
            }
        }
    }
        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            res.status(500).json({
            error: error
        });
        }
        finally {

            // Disconnect from the gateway
            console.log('Disconnect from Fabric gateway.');
            gateway.disconnect();
    
        }
  
  });

  app.post('/api/viewMyEHR', async function (req, res) {

    try {
            const walletPath = path.join(process.cwd(), 'identity/user/hospital1-user/wallet');
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);


            // A gateway defines the peers used to access Fabric networks
            const gateway = new Gateway();


            // Specify userName for network access
    
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

        
            console.log('Use network channel: ehrchannel.');

            const network = await gateway.getNetwork('ehrchannel');

        

            const contract = await network.getContract('ehr-contract');

            
    
            const result = await contract.evaluateTransaction('queryAsset', req.body.patientId.toString());
            let jsonres = result.toString();
            var obj = JSON.parse(jsonres);
            var resObj = [];
            for(var i in obj){
                resObj.push(obj[i]);
                    
            }
                //console.log(res.toString());
                let pid = 'PatientID                 : ' + resObj[0];
                let pname = 'Patient Name          : ' + resObj[1];
                let doc = 'Doctor                     : ' + resObj[5];
                let hos = 'Hospital                   : ' + resObj[7];
                let dis = 'Disease                   : ' + resObj[8];
                let rep = 'Report                     : ' + resObj[9];
                let pres = 'Prescription             : ' + resObj[10];
                let EHR = pid + "\n" + pname + "\n" + doc + "\n" + hos + "\n" + dis + "\n" + rep + "\n" + pres; 

                let pdfDoc = new PDFDocument;
                pdfDoc.pipe(fs.createWriteStream(`${resObj[0]}_${resObj[1]}_My_Report.pdf`));
                pdfDoc.text(EHR);
                pdfDoc.end();
                res.render('success4');
                console.log(EHR);
                /*for(let i=0 ; i < temp.length ; i++){

                }*/
        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            res.status(500).json({
            error: error
        });
        }
        finally {

            // Disconnect from the gateway
            console.log('Disconnect from Fabric gateway.');
            gateway.disconnect();
    
        }
  
  });

  app.post('/api/requestAccessEHR', async function (req, res) {

    try {
            const walletPath = path.join(process.cwd(), 'identity/user/hospital1-user/wallet');
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);


            // A gateway defines the peers used to access Fabric networks
            const gateway = new Gateway();


            // Specify userName for network access
    
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

        
            console.log('Use network channel: ehrchannel.');

            const network = await gateway.getNetwork('ehrchannel');

        

            const contract = await network.getContract('ehr-contract');

            let emailID = await contract.evaluateTransaction('getEmailID', req.body.patientId.toString());

            let doctorname = await contract.evaluateTransaction('getDoctorName', req.body.doctorId.toString());

            let doctorid = req.body.doctorId.toString();

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'mohsinkhan.mufc@gmail.com',
                  pass: 'Mohsin#mufc05'
                }
              });

            let etext = `Hello! This is your Doctor, ${doctorname}. I request you to please provide me the access to your EHR. My ID is ${doctorid}. \n\n\n\nThank you!!!!`;
            var mailOptions = {
            from: 'mohsinkhan.mufc@gmail.com',
            to: emailID,
            subject: 'Request Access to View Your EHR',
            text: etext
            };

            transporter.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log(error);
            } else {
        console.log('Email sent: ' + info.response);
        res.render('success9');
        }
        });

            
    
            
        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            res.status(500).json({
            error: error
        });
        }
        finally {

            // Disconnect from the gateway
            console.log('Disconnect from Fabric gateway.');
            gateway.disconnect();
    
        }
  
  });


  app.listen(3000, () => {
    console.log("***********************************");
    console.log('REST Server listening on port 3000');
    console.log("***********************************");
  });
  