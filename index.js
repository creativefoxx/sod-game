const { makeWALegacySocket } = require('@adiwajshing/baileys')
const chalk = require('chalk')
const gis = require('g-i-s')
const fs = require('fs')

// database sod 
const sod = JSON.parse(fs.readFileSync('./database/database.json'))

module.exports = index = async(m, sock) => {
  try {
    const type = Object.keys(m.message)[0]
    body = (type === 'conversation') ? m.message.conversation : (type == 'imageMessage') ? m.message.imageMessage.caption : (type == 'videoMessage') ? m.message.videoMessage.caption : (type == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (type == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (type == 'listResponseMessage') ? m.omessage.listResponseMessage.singleSelectReply.selectedRowId : (type == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (type === 'messageContextInfo') ? m.message.buttonsResponseMessage.selectedButtonId : ''
    budy = (type === 'conversation') ? m.message.conversation : (type === 'extendedTextMessage') ? m.message.extendedTextMessage.text : ''
    const args = body.trim().split(/ +/).slice(1)
    const prefix = /^[°•π÷×¶∆£¢€¥®™=|~!#$%^&.?/\\©^z+*@,;]/.test(body) ? body.match(/^[°•π÷×¶∆£¢€¥®™=|~!#$%^&.?/\\©^z+*,;]/gi) : '-'
    const command = body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase()
    const from = m.key.remoteJid ? m.key.remoteJid : m.key.participant
    const sender = m.key.participant ? m.key.participant : m.key.remoteJid
    
    switch(command) {
      case 'request': case 'req':
        if (args.length === 0) return sock.sendMessage(from, { text: `Example : ${prefix + command} spill buah favorit`})
        sod.push(args.join(' '))
        fs.writeFileSync('./database/database.json', JSON.stringify(sod))
        sock.sendMessage(from, { text: 'Sukses menambah request'}, { quoted: m})
        break
      case 'random':
        ran = sod[Math.floor(Math.random() * sod.length)]
        buttons = [
          { buttonId: 'random', buttonText: { displayText: 'SPILL'}, type: 1},
          { buttonId: 'minum', buttonText: { displayText: 'DRINK'}, type: 1}
        ]
        buttonMessage = {
          text: ran,
          footer: 'Creative Fox',
          buttons: buttons,
          headerType: 1
        }
        sock.sendMessage(from, buttonMessage)
        break
        case 'minum':
          words_a = ["Suka minum ya om?", "Demen banget minum :>", "Nihh minum", "", "Minum terossss"]
          words_b = ["drink", "boba", "juice fruit", "juice", "air mineral"]
          for_words_a = words_a[Math.floor(Math.random() * words_a.length)]
          for_words_b = words_b[Math.floor(Math.random() * words_b.length)]
          gises = await gis(for_words_b, google)
          function google(error, result) {
          if (error) {
            console.log('error bruh')
          } else {
            result_gises = result[Math.floor(Math.random() * result.length )]
            sock.sendMessage(from, { image: { url: result_gises.url }, caption: for_words_a})
          }
          }
          break
          /**
      case 'join': 
        if (args.length === 0) return sock.sendMessage(from, { text: `Example : ${prefix + command} https://chat.whatsapp.com/xxxxxxxx`})
        await sock.groupAcceptInvite(args.join(' ').replace('https://chat.whatsapp.com/', ''))
        sock.sendMessage(from, { text: 'Success join in your group :)'})
        break
        **/
      case '>'.replace(prefix, ''):
        await sock.sendMessage(from, { text: JSON.stringify(eval(args.join(' ')), null, 2)})
        break
        case '?': case 'start': case 'help': case 'menu': {
        buttons = [
          { buttonId: 'random', buttonText: { displayText: 'SPILL'}, type: 1},
          { buttonId: 'minum', buttonText: { displayText: 'DRINK'}, type: 1}
        ]
       buttonMessage = {
         text: `Hallo Minna!\n\n*Spill or Drink* sendiri merupakan sebuah permainan, dimana pemainnya bisa memilih antara spill atau drink. Spill sendiri berarti menunjukkan, sementara untuk drink sendiri berarti meminum sesuatu. Pemain bisa memilih antara menunjukkan atau meminum sesuatu yang telah diminta dalam permainan tersebut.\n\n*Cara Bermain:*\n*/spill* Gunakan command ini untuk menampilkan pertanyaan\n*/drink* Gunakan command ini untuk men skip pertanyaan\n*/request* Gunakan command ini untuk menambah pertanyaan\n*/contact* Gunakan command ini untuk info lebih lanjut\n\nSelamat bermain.`,
         footer: 'Creative Fox',
         buttons: buttons,
         headerType: 1
       }
       sock.sendMessage(from, buttonMessage)
      }
      break
      case 'contact': case 'kontak': case 'owner': case 'ct':
        vcard = 'BEGIN:VCARD\n'
            + 'VERSION:3.0\n' 
            + 'FN:Muhammad Shulhan Zidni\n'
            + 'ORG:Creative Fox;\n'
            + 'TEL;type=CELL;type=VOICE;waid=62895336253039:+62895336253039\n'
            + 'END:VCARD'
        sock.sendMessage(from, { contacts: { displayName: 'Hans - Creative Fox', contacts: [{ vcard }]}})
        sock.sendMessage(from, { text: 'Hi, this my developer u can call his *Hans*'})
      break
      default:
    }
  } catch (e) {
    console.log(e)
  }
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(`Update ${__filename}`)
	delete require.cache[file]
	require(file)
})
