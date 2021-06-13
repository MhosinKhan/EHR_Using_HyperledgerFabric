export CORE_PEER_TLS_ENABLED=true
export ORDERER_CA=${PWD}/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
export PEER0_HOSPITAL1_CA=${PWD}/crypto-config/peerOrganizations/hospital1.example.com/peers/peer0.hospital1.example.com/tls/ca.crt
#export PEER1_HOSPITAL1_CA=${PWD}/crypto-config/peerOrganizations/hospital1.example.com/peers/peer1.hospital1.example.com/tls/ca.crt
export PEER0_HOSPITAL2_CA=${PWD}/crypto-config/peerOrganizations/hospital2.example.com/peers/peer0.hospital2.example.com/tls/ca.crt
#export PEER1_HOSPITAL2_CA=${PWD}/crypto-config/peerOrganizations/hospital2.example.com/peers/peer1.hospital2.example.com/tls/ca.crt

export FABRIC_CFG_PATH=${PWD}/channels/config/
export CHANNEL_NAME=ehrchannel

setGlobalsForOrderer(){
    export CORE_PEER_LOCALMSPID="OrdererMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
    export CORE_PEER_MSPCONFIGPATH=${PWD}/crypto-config/ordererOrganizations/example.com/users/Admin@example.com/msp
}

setGlobalsForPeer0Hospital1(){
    export CORE_PEER_LOCALMSPID="Hospital1MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_HOSPITAL1_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/crypto-config/peerOrganizations/hospital1.example.com/users/Admin@hospital1.example.com/msp
    export CORE_PEER_ADDRESS=localhost:7051
}

setGlobalsForPeer0Hospital2(){
    export CORE_PEER_LOCALMSPID="Hospital2MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_HOSPITAL2_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/crypto-config/peerOrganizations/hospital2.example.com/users/Admin@hospital2.example.com/msp
    export CORE_PEER_ADDRESS=localhost:8051
    
}


CHANNEL_NAME="ehrchannel"
CC_RUNTIME_LANGUAGE="node"
VERSION="1"
CC_SRC_PATH="./chaincode"
CC_NAME="ehr-contract"


packageChaincode() {
    rm -rf ${CC_NAME}.tar.gz
    
    peer lifecycle chaincode package ${CC_NAME}.tar.gz \
        --path ${CC_SRC_PATH} --lang ${CC_RUNTIME_LANGUAGE} \
        --label ${CC_NAME}_${VERSION}
    echo "===================== Chaincode is packaged on peer0.producer ===================== "
}
packageChaincode

installChaincode() {
    setGlobalsForPeer0Hospital1
    peer lifecycle chaincode install ${CC_NAME}.tar.gz
    echo "===================== Chaincode is installed on peer0.hospital1 ===================== "

     
    setGlobalsForPeer0Hospital2
    peer lifecycle chaincode install ${CC_NAME}.tar.gz
    echo "===================== Chaincode is installed on peer0.hospital2 ===================== "

     
}
installChaincode

queryInstalled() {
    setGlobalsForPeer0Hospital1
    peer lifecycle chaincode queryinstalled >&log.txt
    cat log.txt
    PACKAGE_ID=$(sed -n "/${CC_NAME}_${VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)
    echo PackageID is ${PACKAGE_ID}
    echo "===================== Query installed successful on peer0.producer on channel ===================== "
}
queryInstalled

approveForHospital1() {
    setGlobalsForPeer0Hospital1
    # set -x
    peer lifecycle chaincode approveformyorg -o localhost:7050 \
        --ordererTLSHostnameOverride orderer.example.com --tls \
        --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name ${CC_NAME} --version ${VERSION} \
        --init-required --package-id ${PACKAGE_ID} \
        --sequence ${VERSION}
    # set +x

    echo "===================== chaincode approved from hospital1 organization ===================== "

}
approveForHospital1

approveForHospital2() {
    setGlobalsForPeer0Hospital2

    peer lifecycle chaincode approveformyorg -o localhost:7050 \
        --ordererTLSHostnameOverride orderer.example.com --tls $CORE_PEER_TLS_ENABLED \
        --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name ${CC_NAME} \
        --version ${VERSION} --init-required --package-id ${PACKAGE_ID} \
        --sequence ${VERSION}

    echo "===================== chaincode approved from hospital2 organization ===================== "
}
approveForHospital2

checkCommitReadiness() {
    setGlobalsForPeer0Hospital1
    peer lifecycle chaincode checkcommitreadiness \
        --channelID $CHANNEL_NAME --name ${CC_NAME} --version ${VERSION} \
        --sequence ${VERSION} --output json --init-required
    echo "===================== checking commit readiness from all organizations ===================== "
}
checkCommitReadiness

commitChaincodeDefination() {
    setGlobalsForPeer0Hospital1
    #required to get crypto materials like msp
    peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com \
        --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
        --channelID $CHANNEL_NAME --name ${CC_NAME} \
        --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_HOSPITAL1_CA \
        --peerAddresses localhost:8051 --tlsRootCertFiles $PEER0_HOSPITAL2_CA \
        --version ${VERSION} --sequence ${VERSION} --init-required

}
commitChaincodeDefination

queryCommitted() {
    setGlobalsForPeer0Hospital1
    peer lifecycle chaincode querycommitted --channelID $CHANNEL_NAME --name ${CC_NAME}

}
queryCommitted

chaincodeInvokeInit() {
    setGlobalsForPeer0Hospital1
    peer chaincode invoke -o localhost:7050 \
        --ordererTLSHostnameOverride orderer.example.com \
        --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
        -C $CHANNEL_NAME -n ${CC_NAME} \
        --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_HOSPITAL1_CA \
        --peerAddresses localhost:8051 --tlsRootCertFiles $PEER0_HOSPITAL2_CA \
        --isInit -c '{"Args":[]}'

}
chaincodeInvokeInit