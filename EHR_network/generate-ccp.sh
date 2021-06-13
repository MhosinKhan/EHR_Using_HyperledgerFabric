#!/bin/bash

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    local PP=$(one_line_pem $5)
    local CP=$(one_line_pem $6)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${ORGMSP}/$2/" \
        -e "s/\${P0PORT}/$3/" \
        -e "s/\${CAPORT}/$4/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        ./connections/ccp-template.json 
}

function yaml_ccp {
    local PP=$(one_line_pem $5)
    local CP=$(one_line_pem $6)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${ORGMSP}/$2/" \
        -e "s/\${P0PORT}/$3/" \
        -e "s/\${CAPORT}/$4/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        ./connections/ccp-template.yaml | sed -e $'s/\\\\n/\\\n          /g'
}


ORG=hospital1
ORGMSP=Hospital1
P0PORT=7051
CAPORT=7054
PEERPEM=./crypto-config/peerOrganizations/hospital1.example.com/tlsca/tlsca.hospital1.example.com-cert.pem
CAPEM=./crypto-config/peerOrganizations/hospital1.example.com/ca/ca.hospital1.example.com-cert.pem

echo "$(json_ccp $ORG $ORGMSP $P0PORT $CAPORT $PEERPEM $CAPEM)" > ./connections/connection-hospital1.json
echo "$(yaml_ccp $ORG $ORGMSP $P0PORT $CAPORT $PEERPEM $CAPEM)" > ./connections/connection-hospital1.yaml

ORG=hospital2
ORGMSP=Hospital1
P0PORT=8051
CAPORT=8054
PEERPEM=./crypto-config/peerOrganizations/hospital2.example.com/tlsca/tlsca.hospital2.example.com-cert.pem
CAPEM=./crypto-config/peerOrganizations/hospital2.example.com/ca/ca.hospital2.example.com-cert.pem

echo "$(json_ccp $ORG $ORGMSP $P0PORT $CAPORT $PEERPEM $CAPEM)" > ./connections/connection-hospital2.json
echo "$(yaml_ccp $ORG $ORGMSP $P0PORT $CAPORT $PEERPEM $CAPEM)" > ./connections/connection-hospital2.yaml
