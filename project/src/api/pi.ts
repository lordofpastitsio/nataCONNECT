export const PI_URL = 'http://10.36.234.47:3001';

export const piAPI = {
  getMembers: () => 
    fetch(`${PI_URL}/family/members`).then(r => r.json()),
  
  verifyPin: (memberId: string, pin: string) =>
    fetch(`${PI_URL}/family/verify-pin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId, pin })
    }).then(r => r.json()),

  getCards: (memberId: string) =>
    fetch(`${PI_URL}/cards/${memberId}`).then(r => r.json()),

  getTransactions: (cardId: string) =>
    fetch(`${PI_URL}/transactions/${cardId}`).then(r => r.json()),

  getGoals: (memberId: string) =>
    fetch(`${PI_URL}/goals/${memberId}`).then(r => r.json()),

  getShieldRules: (memberId: string) =>
    fetch(`${PI_URL}/shield/${memberId}`).then(r => r.json()),

  lockPhone: (deviceId: string, passcode: string, memberId: string) =>
    fetch(`${PI_URL}/emergency/lock-phone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId, passcode, memberId })
    }).then(r => r.json()),

  getStatus: () =>
    fetch(`${PI_URL}/pi/status`).then(r => r.json()),
};