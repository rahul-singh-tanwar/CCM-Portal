import { ZBClient } from 'zeebe-node';
import fs from 'fs';

// 🔐 Environment variables (replace or use process.env)
const zbc = new ZBClient({
  hostname: process.env.ZEEBE_ADDRESS || 'localhost',
  useTLS: false, // ❗ important
  oAuth: {
    url: process.env.ZEEBE_AUTHORIZATION_SERVER_URL || 'http://localhost:18080/auth/realms/camunda-platform/protocol/openid-connect/token',
    clientId: process.env.ZEEBE_CLIENT_ID || 'orchestration',
    clientSecret: process.env.ZEEBE_CLIENT_SECRET || 'secret'
  }
});

const users = ['user1', 'user2'];
const rotationFile = './rotation.json';

function getCurrentIndex() {
  if (!fs.existsSync(rotationFile)) return 0;
  try {
    const data = JSON.parse(fs.readFileSync(rotationFile, 'utf8'));
    return data.index ?? 0;
  } catch {
    return 0;
  }
}

function saveCurrentIndex(index) {
  fs.writeFileSync(rotationFile, JSON.stringify({ index }));
}

let currentIndex = getCurrentIndex();

zbc.createWorker({
  taskType: 'assign-reviewer',
  taskHandler: async (job) => {
    const users = ['user1', 'user2'];
    const index = Math.floor(Math.random() * users.length);
    const assignee = users[index];
    console.log(`✅ Assigned to: ${assignee}`);

    // ✅ Correct way to complete the job
    await job.complete({ assignee });

  }
});
