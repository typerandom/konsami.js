var Konsami = function (callback, match_sequence, listen_source, lookup) {
    this.sequence_matches = 0;
    this.keyboard_token_sequence = [];
    this.unknown_key_token = "UNKNOWN";
    this.setCallback(callback);
    this.setMatchSequence(match_sequence);
    this.setListenSource(listen_source || document);
    this.setKeyboardTokenLookup(lookup);
};

Konsami.prototype.setCallback = function(callback){
  this.callback = callback;
};

Konsami.prototype.setMatchSequence = function(sequence){
  this.match_sequence = sequence || [];
};

Konsami.prototype.setListenSource = function(source){
  this.listen_source = source;
};

Konsami.prototype.setKeyboardTokenLookup = function(lookup){
  this.keyboard_token_lookup = lookup || {
        // Table needs to be filled out...
        37: "LEFT",
        38: "UP",
        39: "RIGHT",
        40: "DOWN",
        65: "A",
        66: "B",
        13: "ENTER"
    };
};

Konsami.prototype.initialize = function () {
    this.listen();
};

Konsami.prototype.listen = function () {
    var outer_scope = this;
    this.listen_source.addEventListener("keydown", function (e) {
        outer_scope.handleEvent(e.which);
    });
};

Konsami.prototype.handleEvent = function (key_code) {
    this.keyboard_token_sequence.push(key_code in this.keyboard_token_lookup
        ? this.keyboard_token_lookup[key_code] : this.unknown_key_token);

    if (this.keyboard_token_sequence.length > this.match_sequence.length) {
        this.keyboard_token_sequence.splice(0, 1); //POP!
    }

    if(this.callback && this.hasMatchingSequence(this.keyboard_token_sequence, this.match_sequence)){
        this.callback(++this.sequence_matches);
    }
};

Konsami.prototype.hasMatchingSequence = function (current, match) {
    if (current.length == match.length) {
        for (var i = 0; i < match.length; ++i) {
            if (match[i] != current[i]) {
                break;
            } else if (match.length - 1 == i) {
                return true;
            }
        }
    }

    return false;
};