function getMessageHash(
  category,
  title,
  message,
  user,
  pubkey,
  address,
  randId,
  created,
  description
) {
  //Create one long string..
  var fullmessage =
    category +
    title +
    message +
    user +
    pubkey +
    address +
    randId +
    created +
    "";
  var urlencoded = encodeURIComponent(fullmessage);

  //Now hash it..
  return sha1(urlencoded);
}

function checkMessageSig(
  category,
  title,
  message,
  user,
  pubkey,
  address,
  randId,
  created,
  signature,
  callback
) {
  //First create the message signature..
  var hash = getMessageHash(
    category,
    title,
    message,
    user,
    pubkey,
    address,
    randId,
    created,
  );

  //Now sign the hash..
  MDS.cmd(
    "maxverify data:" +
      hash +
      " publickey:" +
      pubkey +
      " signature:" +
      signature,
    function (ver) {
      if (ver.response.valid) {
        callback(true);
      } else {
        callback(false);
      }
    }
  );
}

function sendTxnMessage(
  category,
  title,
  message,
  user,
  pubkey,
  address,
  randId,
  created,
  callback
) {
  //First create the message signature..
  var hash = getMessageHash(
    category,
    title,
    message,
    user,
    pubkey,
    address,
    randId,
    created,
  );

  //Now sign the hash..
  MDS.cmd("maxsign data:" + hash, function (resp) {
    var signature = resp.response.signature;

    //Now construct..
    var state = {};
    state[0] = "[" + category + "]";
    state[1] = "[" + title + "]";
    state[2] = "[" + message + "]";
    state[3] = "[" + user + "]";
    state[4] = randId + "";
    state[5] = pubkey + "";
    state[6] = signature + "";
    state[7] = "[" + address + "]";
    state[8] = created + "";

    var func =
      "send storestate:false amount:0.01 address:0x6D696E69766F782061646472657373 state:" +
      JSON.stringify(state);

    //run it..
    MDS.cmd(func, function (sendresp) {
      if (callback) {
        callback(sendresp);
      }
    });
  });
}
