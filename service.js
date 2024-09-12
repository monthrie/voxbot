/**
 * SHOUTOUT backend service
 *
 * @spartacusrex
 */

//Are we logging data
var logs = true;

var USER_NAME = "";
var USER_PUBKEY = "";
var USER_ADDRESS = "Mx999";
const SHOUTOUT_ADDRESS = "0x6D696E69766F782061646472657373";

function checkTxn(msg) {
  if (msg.data.coin.tokenid != "0x00") {
    MDS.log("Message not sent as Minima.. ! " + msg.data.coin.tokenid);
    return false;
  } else if (+msg.data.coin.amount < 0.01) {
    MDS.log("Message below 0.01 threshold.. ! " + msg.data.coin.amount);
    return false;
  }
  return true;
}

//Main message handler
MDS.init(function (msg) {
  if (msg.event == "inited") {
      MDS.cmd("maxima;getaddress", function (startup) {
        //Get the user details
        USER_NAME = startup[0].response.name;
        USER_PUBKEY = startup[0].response.publickey;
      });
  } 
});
