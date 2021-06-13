# echo "Creating crypto materials..."
# cryptogen generate --config=./crypto-config.yaml --output=./crypto-config
# echo "Generated crypto materials successfully!!!"

# echo "Generating connection profiles for each organization..."
# ./generate-ccp.sh
# echo "Connection profiles generated successfully!!!"

 SYS_CHANNEL="sys-channel"

 CHANNEL_NAME="ehrchannel"

 echo $CHANNEL_NAME

 echo "Generating genesis block and mychannel.tx files..."
 configtxgen -configPath . -profile EHROrdererGenesis -channelID $SYS_CHANNEL -outputBlock ./channel-artifacts/genesis.block


 configtxgen -configPath . -profile EHRChannel -channelID $CHANNEL_NAME -outputCreateChannelTx ./channel-artifacts/ehrchannel.tx

 echo "Genesis block and mychannel.tx file generated successfully in channel-artifacts folder!!!"

echo "Creating anchor peers for each organization..."
configtxgen -profile EHRChannel -configPath . -outputAnchorPeersUpdate ./channel-artifacts/Hospital1MSPAnchors.tx -channelID $CHANNEL_NAME -asOrg Hospital1MSP
configtxgen -profile EHRChannel -configPath . -outputAnchorPeersUpdate ./channel-artifacts/Hospital2MSPAnchors.tx -channelID $CHANNEL_NAME -asOrg Hospital2MSP
echo "Anchor peers created successfully!!!"

