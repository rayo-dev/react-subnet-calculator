import React, { useState } from 'react';
import { Container, TextField, Button } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

function SubnetCalculator() {
  const [ipAddress, setIpAddress] = useState('10.21.150.251');
  const [subnetMask, setSubnetMask] = useState('/24');
  const [networkAddress, setNetworkAddress] = useState('');
  const [broadcastAddress, setBroadcastAddress] = useState('');
  const [firstHost, setFirstHost] = useState('');
  const [lastHost, setLastHost] = useState('');
  const [hostCount, setHostCount] = useState(0);

  const calculateSubnet = () => {
    const octets = ipAddress.split('.').map(Number);
    const maskBits = Number(subnetMask.replace('/', ''));
    const mask = calculateMask(maskBits);
    const network = calculateNetworkAddress(octets, mask);
    const broadcast = calculateBroadcastAddress(octets, mask);
    const first = calculateFirstHost(network);
    const last = calculateLastHost(broadcast);
    const count = calculateHostCount(maskBits);

    setNetworkAddress(formatIPAddress(network));
    setBroadcastAddress(formatIPAddress(broadcast));
    setFirstHost(formatIPAddress(first));
    setLastHost(formatIPAddress(last));
    setHostCount(count);
  };

  const calculateMask = (maskBits) => {
    const mask = [0, 0, 0, 0];
    for (let i = 0; i < maskBits; i++) {
      const octetIndex = Math.floor(i / 8);
      const bitIndex = i % 8;
      mask[octetIndex] |= 1 << (7 - bitIndex);
    }
    return mask;
  };

  const calculateNetworkAddress = (ip, mask) => {
    const network = [0, 0, 0, 0];
    for (let i = 0; i < 4; i++) {
      network[i] = ip[i] & mask[i];
    }
    return network;
  };

  const calculateBroadcastAddress = (ip, mask) => {
    const broadcast = [0, 0, 0, 0];
    for (let i = 0; i < 4; i++) {
      broadcast[i] = ip[i] | (255 - mask[i]);
    }
    return broadcast;
  };

  const calculateFirstHost = (network) => {
    const firstHost = [...network];
    firstHost[3] += 1;
    return firstHost;
  };

  const calculateLastHost = (broadcast) => {
    const lastHost = [...broadcast];
    lastHost[3] -= 1;
    return lastHost;
  };

  const calculateHostCount = (maskBits) => {
    return Math.pow(2, 32 - maskBits) - 2;
  };

  const formatIPAddress = (ip) => {
    return ip.join('.');
  };

  const columns: GridColDef[] = [
    { field: 'property', headerName: 'Property', flex: 1 },
    { field: 'value', headerName: 'Value', flex: 1 },
  ];

  const rows = [
    { id: 1, property: 'Network Address', value: networkAddress },
    { id: 2, property: 'Broadcast Address', value: broadcastAddress },
    { id: 3, property: 'First Host', value: firstHost },
    { id: 4, property: 'Last Host', value: lastHost },
    { id: 5, property: 'Host Count', value: hostCount.toString() },
  ];

  return (
    <Container maxWidth="sm" style={{ marginTop: '40px' }}>
      <h2>Subnet Calculator</h2>

      <TextField
        label="IP Address"
        value={ipAddress}
        onChange={(e) => setIpAddress(e.target.value)}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Subnet Mask"
        value={subnetMask}
        onChange={(e) => setSubnetMask(e.target.value)}
        fullWidth
        margin="normal"
      />

      <Button variant="contained" color="primary" onClick={calculateSubnet}>
        Calculate
      </Button>

      {networkAddress && (
        <div style={{ marginTop: '20px', height: '500px', width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            autoPageSize={true}
            disableColumnMenu={true}
          />
        </div>
      )}
    </Container>
  );
}

export default SubnetCalculator;
