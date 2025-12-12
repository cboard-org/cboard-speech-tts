
var SpeechSynthesisVoiceList = function(data) {
  if (!data || !Array.isArray(data)) {
    this._list = [];
  } else {
    this._list = data;
  }
  this.length = this._list.length;
};
    
SpeechSynthesisVoiceList.prototype.item = function(item) {
    return this._list[item];
};

module.exports = SpeechSynthesisVoiceList;