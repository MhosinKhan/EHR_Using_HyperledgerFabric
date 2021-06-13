'use strict';

const { Contract } = require('fabric-contract-api');

class EHRCC extends Contract {


  async addPatient(ctx, patientDetails) {
    console.info('============= START : Add asset ===========');
    await ctx.stub.putState(JSON.parse(patientDetails).patientId.toString(), Buffer.from(patientDetails));
    console.info('============= END : Add asset ===========');
    return ctx.stub.getTxID()
  }

  async registerHospitalAdmin(ctx, adminDetails) {
    console.info('============= START : Add asset ===========');
    await ctx.stub.putState(JSON.parse(adminDetails).hospitalId.toString(), Buffer.from(adminDetails));
    console.info('============= END : Add asset ===========');
    return ctx.stub.getTxID()
  }

  async getAdminEmail(ctx, hospitalId){
    let flag = 'no';
    const assetAsBytes = await ctx.stub.getState(hospitalId); 
    if (!assetAsBytes || assetAsBytes.length === 0) {
      return flag;
    }
    else {
      let key = JSON.parse(assetAsBytes.toString());
      let email = key.emailId.toString();
      return email;
    }
  }

  async isPatientRegistered(ctx, patientId){
    let flag = 'yes';
    const assetAsBytes = await ctx.stub.getState(patientId); 
    if (!assetAsBytes || assetAsBytes.length === 0) {
      flag = 'no';
    }
    return flag;
  }
 
  async addDoctor(ctx, details) {
    await ctx.stub.putState(JSON.parse(details).doctorId.toString(),Buffer.from(details));
    return ctx.stub.getTxID()
  }

  async assignPatToDoc(ctx, doctorId, patientId) {
    const assetAsBytes = await ctx.stub.getState(doctorId); 
    let key = JSON.parse(assetAsBytes.toString());
    key.consultIds = patientId.toString();
    await ctx.stub.putState(doctorId, Buffer.from(JSON.stringify(key)));
    return ctx.stub.getTxID();
  }

  async editPatientDetails(ctx, patientId, doctorId){
    const assetAsBytes = await ctx.stub.getState(patientId); 
    if (!assetAsBytes || assetAsBytes.length === 0) {
      throw new Error(`${patientId} does not exist`);
    }
    const assetAsBytes1 = await ctx.stub.getState(doctorId);
    let key = JSON.parse(assetAsBytes.toString());
    let key1 = JSON.parse(assetAsBytes1.toString());
    key.doctorId = doctorId;
    key.doctorName = key1.doctorName;
    key.hospitalId = key1.hospitalId;
    key.hospitalName = key1.hospitalName; 
    await ctx.stub.putState(patientId.toString(), Buffer.from(JSON.stringify(key)));
    return ctx.stub.getTxID();
  }

  async queryAsset(ctx, patientId) {
    console.info('============= START : Query asset ===========');
    const assetAsBytes = await ctx.stub.getState(patientId); 
    if (!assetAsBytes || assetAsBytes.length === 0) {
      throw new Error(`${patientId} does not exist`);
    }
    console.log(assetAsBytes.toString());
    console.info('============= END : Query asset ===========');
    return assetAsBytes.toString();
  }

  async viewDocDetails(ctx, doctorId, patientId) {
    const assetAsBytes = await ctx.stub.getState(doctorId); 
    if (!assetAsBytes || assetAsBytes.length === 0) {
      throw new Error(`${patientId} does not exist`);
    }
    console.log(assetAsBytes.toString());
    let key = JSON.parse(assetAsBytes.toString());
    let consultIds = key.consultIds.toString();
    let results = 'absent';
    for (let i = 0; i < consultIds.length; i++){
        if( consultIds[i] === patientId ){
          results = 'present';
          break;
        }
    }
    return results;
    //return assetAsBytes.toString();
  }
  
  async getDoctorName(ctx,doctorId) {
  	const assetAsBytes = await ctx.stub.getState(doctorId); 
  	if (!assetAsBytes || assetAsBytes.length === 0) {
      		throw new Error(`${patientId} does not exist`);
      	}
 	let key = JSON.parse(assetAsBytes.toString());
 	return key.doctorName.toString();
  }
  
  async updateEHR(ctx, patientId, disease, report, prescription) {
    console.info('============= START : Query asset ===========');
    const assetAsBytes = await ctx.stub.getState(patientId); 
    if (!assetAsBytes || assetAsBytes.length === 0) {
      throw new Error(`${patientId} does not exist`);
    }
    //console.log(assetAsBytes.toString());
    let key = JSON.parse(assetAsBytes.toString());
    key.disease = disease;
    key.report = report;
    key.prescription = prescription;
    await ctx.stub.putState(patientId, Buffer.from(JSON.stringify(key)));
    console.info('============= END ===========');
    return ctx.stub.getTxID();
  }
  
  async shareEHR(ctx, patientId, doctorId) {
    const assetAsBytes = await ctx.stub.getState(doctorId); 
    const assetAsBytes1 = await ctx.stub.getState(patientId); 
    if (!assetAsBytes || assetAsBytes.length === 0) {
      throw new Error(`${patientId} does not exist`);
    }
    let key = JSON.parse(assetAsBytes.toString());
    let key1 = JSON.parse(assetAsBytes1.toString());
    let ids = key.consultIds;
    key.consultIds = ids.toString() + patientId.toString();
    key1.doctorId = key.doctorId;
    key1.doctorName = key.doctorName;
    key1.hospitalId = key.hospitalId;
    key1.hospitalName = key.hospitalName; 
    await ctx.stub.putState(doctorId, Buffer.from(JSON.stringify(key)));
    await ctx.stub.putState(patientId, Buffer.from(JSON.stringify(key1)));
    return ctx.stub.getTxID();
  }

  async getPatientHistory(ctx, patientId) {
    console.info('============= START : Query History ===========');
    let iterator = await ctx.stub.getHistoryForKey(patientId);
    let result = [];
    let res = await iterator.next();
    while (!res.done) {
      if (res.value) {
        console.info(`found state update with value: ${res.value.value.toString('utf8')}`);
        const obj = JSON.parse(res.value.value.toString('utf8'));
        result.push(obj);
      }
      res = await iterator.next();
    }
    await iterator.close();
    console.info('============= END : Query History ===========');
    return result;  
  }
  async getEmailID(ctx, patientID){
    const assetAsBytes = await ctx.stub.getState(patientID);
    if (!assetAsBytes || assetAsBytes.length === 0) {
      throw new Error(`${patientId} does not exist`);
    }
    let key = JSON.parse(assetAsBytes.toString());
    return key.emailId.toString();
  }
  /*async setPosition(ctx, id, latitude, longitude) {
    console.info('============= START : Set position ===========');
    const keyAsBytes = await ctx.stub.getState(id); 
    if (!keyAsBytes || keyAsBytes.length === 0) {
      throw new Error(`${id} does not exist`);
    }
    let key = JSON.parse(keyAsBytes.toString());
    key.latitude = latitude;
    key.longitude = longitude;
    await ctx.stub.putState(id, Buffer.from(JSON.stringify(key)));
    console.info('============= END : Set position ===========');
    return ctx.stub.getTxID();
  }

  async getHistory(ctx, id) {
    console.info('============= START : Query History ===========');
    let iterator = await ctx.stub.getHistoryForKey(id);
    let result = [];
    let res = await iterator.next();
    while (!res.done) {
      if (res.value) {
        console.info(`found state update with value: ${res.value.value.toString('utf8')}`);
        const obj = JSON.parse(res.value.value.toString('utf8'));
        result.push(obj);
      }
      res = await iterator.next();
    }
    await iterator.close();
    console.info('============= END : Query History ===========');
    return result;  
  }
*/

}

module.exports = EHRCC;

