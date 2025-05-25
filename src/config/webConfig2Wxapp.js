const { v4: uuidv4 } = require('uuid')
// const f1Config = require('./f1.config')
// const f2Config = require('./f2.config')
// const f3Config = require('./f3.config')
// const f4Config = require('./f4.config')
// const f5Config = require('./f5.config')
const b1Config = require('./b1.config')
/**
 *     shopList: [
      {
        text: '电器',
        children: [
          {
            text: '日立',
            isClick: false,
            position: [['0.67', '0.46']],
            id: 1,
          }
        ],
      },
 */

const webConfig2Wxapp = (webConfig) => {
  const wxappConfig = []
  webConfig.forEach((type) => {
    const wxappConfigItem = {
      text: type.type,
      children: [],
    }
    type.content.forEach((item) => {
      wxappConfigItem.children.push({
        text: item.name,
        position: item.position,
        id: uuidv4(),
      })
    })
    wxappConfig.push(wxappConfigItem)
  })
  return JSON.stringify(wxappConfig)
}

// const res = webConfig2Wxapp(f1Config)
// const res = webConfig2Wxapp(f2Config)
const res = webConfig2Wxapp(b1Config)
console.log(res)
