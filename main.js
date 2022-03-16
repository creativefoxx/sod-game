const { makeWALegacySocket, fetchLatestBaileysVersion, useSingleFileLegacyAuthState } = require('@adiwajshing/baileys')
const pino = require('pino')
const fs = require('fs')

// session 
const { state, saveState } = useSingleFileLegacyAuthState('./session.json')

// start
const startSock = async() => {
  // fetch WA version 
  const { version, isLatest } = await fetchLatestBaileysVersion()
  console.log(`Using WA version ${version}, isLatest ${isLatest}`)
  
  const sock = makeWALegacySocket({
    version,
    logger: pino({ level: 'debug'}),
    printQRInTerminal: true,
    auth: state
  })
  sock.ev.on('creds.update', saveState)
  
  sock.ev.on('messages.upsert', async m => {
    try {
      const mek = m.messages[0]
      require('./index')(mek, sock)
    } catch (e) {
      console.log(e)
    }
  })
  
  return sock
}

startSock()

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(`Update ${__filename}`)
	delete require.cache[file]
	require(file)
})