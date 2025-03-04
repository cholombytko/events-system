'use strict';

const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const GRPC_SERVER_URL = process.env.GRPC_SERVER_URL;
const protoPath = path.join(__dirname, '..', 'proto', 'gateway', 'gateway.proto');

const packageDefinition = protoLoader.loadSync(protoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const { GatewayService } = grpc.loadPackageDefinition(packageDefinition).gateway;

const client = new GatewayService(GRPC_SERVER_URL, grpc.credentials.createInsecure());

const eventMessage = {
  eventId: uuidv4(),
  timestamp: new Date().toISOString(),
  source: 'facebook',
  funnelStage: 'top',
  eventType: 'ad.view',
  data: JSON.stringify({
    user: {
      userId: 'user123',
      name: 'John Doe',
      age: 30,
      gender: 'male',
      location: { country: 'USA', city: 'New York' },
    },
    engagement: {
      actionTime: '2025-03-03T10:05:00Z',
      referrer: 'newsfeed',
      videoId: 'video123',
    },
  }),
};

function sendEvent() {
  client.HandleEvent(eventMessage, (err, response) => {
    if (err) {
      console.error('Error:', err.message);
    } else {
      console.log('Response:', response.message);
    }
  });
}

setInterval(sendEvent, 5000);