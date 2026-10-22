# mnotify-node
mNotify nodeJS Connector (TypeScript)

[![npm version](https://img.shields.io/npm/v/mnotify-node.svg?style=flat-square)](https://www.npmjs.org/package/mnotify-node)
[![install size](https://packagephobia.com/badge?p=mnotify-node)](https://packagephobia.com/result?p=mnotify-node)
[![npm downloads](https://img.shields.io/npm/dm/mnotify-node.svg?style=flat-square)](http://npm-stat.com/charts.html?package=mnotify-node)
![GitHub last commit](https://img.shields.io/github/last-commit/commey/mnotify-node)
![GitHub top language](https://img.shields.io/github/languages/top/commey/mnotify-node)
![GitHub](https://img.shields.io/github/license/commey/mnotify-node)

Full documentation can be found at https://readthedocs.mnotify.com

## Installing

Using npm:

```bash
$ npm install mnotify-node --save
```

## Example

```typescript
import MNotify from 'mnotify-node';

const mNotify = new MNotify("<API_KEY>");

// Get balance
mNotify.smsBalance().then(balance => console.log(balance)); // {"status": "success", "balance": 4000, "bonus": 70}

// Add Group
mNotify.addGroup({
  group_name: "Friends"
})
.then(response => console.log(response)); // {"status": "success", "_id": "3"}
```

## Methods

```typescript
// Message Template Methods
listTemplates()
getTemplate(payload)
addTemplate(payload)
updateTemplate(payload)
deleteTemplate(payload)

// Group Methods
listGroups()
getGroup(payload)
addGroup(payload)
updateGroup(payload)
deleteGroup(payload)

// Contact Methods
listContacts()
listGroupContacts(payload)
getContact(payload)
addContact(payload)
updateContact(payload)
deleteContact(payload)

// Campaign Methods
sendBulkSMS(payload)
sendGroupBulkSMS(payload)
sendBulkCall(payload)
sendGroupBulkVoice(payload)

// Sender Id Methods
registerSenderId(payload)

// Reports And Stats
smsBalance()
voiceBalance()
deliveryReport(payload)
specificDeliveryReport(payload)
periodicDeliveryReport(payload)
voiceCallReport(payload)
specificVoiceCallReport(payload)
periodicVoiceCallReport(payload)
```

See documentation (https://readthedocs.mnotify.com) for required `payload` fields

## Development

```bash
# Install dependencies
npm install

# Build
npm run build
```

## License

[MIT](LICENSE)
