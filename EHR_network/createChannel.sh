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

createChannel(){
    rm -rf ./channel-artifacts/channel-config/*

    echo "Creating channel $CHANNEL_NAME "
    setGlobalsForPeer0Hospital1
    
    peer channel create -o localhost:7050 -c $CHANNEL_NAME \
    --ordererTLSHostnameOverride orderer.example.com \
    -f ./channel-artifacts/${CHANNEL_NAME}.tx --outputBlock ./channel-artifacts/channel-config/${CHANNEL_NAME}.block \
    --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA

    echo "================================Channel '$CHANNEL_NAME' created ================================"
}


joinChannel(){
    
    setGlobalsForPeer0Hospital1
    peer channel join -b ./channel-artifacts/channel-config/$CHANNEL_NAME.block

    
    setGlobalsForPeer0Hospital2
    peer channel join -b ./channel-artifacts/channel-config/$CHANNEL_NAME.block

    

    echo "=========Organizations joined to the channel============="

}

updateAnchorPeers(){
    setGlobalsForPeer0Hospital1
    peer channel update -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com -c $CHANNEL_NAME -f ./channel-artifacts/${CORE_PEER_LOCALMSPID}Anchors.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA
    
    setGlobalsForPeer0Hospital2
    peer channel update -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com -c $CHANNEL_NAME -f ./channel-artifacts/${CORE_PEER_LOCALMSPID}Anchors.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA

    echo "========Anchor peers updated==========="
}

createChannel
joinChannel
updateAnchorPeers
