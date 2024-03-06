String.prototype.hexEncode = function () {
  let hex = ''
  for (let i = 0; i < this.length; i++) {
    const charCode = this.charCodeAt(i)
    const hexValue = charCode.toString(16)

    // Pad with zeros to ensure two-digit representation
    hex += hexValue.padStart(2, '0')
  }
  return hex
}

String.prototype.hexDecode = function () {
  let str = ''
  for (let i = 0; i < this.length; i += 2) {
    const hexValue = this.substr(i, 2)
    const decimalValue = parseInt(hexValue, 16)
    str += String.fromCharCode(decimalValue)
  }
  return str
}

export default {}
