const Errors = require("../ultils/errors")

const TokenControllers = {
  handleGetSupportTokens: (req, res) => {
    const isError = req.query.isError;
    if(isError){
      return res.send(new Errors.ParamError('this is additional data from content error'))
    }

    res.isCache = true
    return res.send(
      {
        suportTokens: [
        {
          "name": "OmiseGO",
          "decimals": 18,
          "address": "0xd26114cd6EE289AccF82350c8d8487fedB8A0C07",
          "symbol": "OMG",
          "id": "0xd26114cd6EE289AccF82350c8d8487fedB8A0C07",
          "trading_enabled": true
        },
        {
          "name": "Ethereum",
          "decimals": 18,
          "address": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
          "symbol": "ETH",
          "id" : "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
          "trading_enabled": true
        },
          {
            "name": "KyberNetwork",
            "decimals": 18,
            "address": "0xdd974D5C2e2928deA5F71b9825b8b646686BD200",
            "symbol": "KNC",
            "id": "0xdd974D5C2e2928deA5F71b9825b8b646686BD200",
            "trading_enabled": true
          },

          {
            "name": "Eos",
            "decimals": 18,
            "address": "0x86Fa049857E0209aa7D9e616F7eb3b3B78ECfdb0",
            "symbol": "EOS",
            "id": "0x86Fa049857E0209aa7D9e616F7eb3b3B78ECfdb0",
            "trading_enabled": true
          }
        ]
      }
    )
  }

}

module.exports = TokenControllers;