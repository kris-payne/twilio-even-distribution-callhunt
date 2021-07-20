const syncServiceSid = 'IS67ac716afd95dd25575f708053702543';
const syncList ='ESfac327054a04471897b48ef4315b32e1';
var client = "";
exports.handler = async function(context, event, callback) {
    client = context.getTwilioClient();
	let items = await readSyncList();
	let phonenumber = {
                            calls: 10000000000,
                            number: null
                        }
                        
    if (!items) { 
        phonenumber.number = "+61405468859";
    } else {
        for(var i in items) {
            let item = items[i].data.itemData;
            console.log(item); 
            if (item.status == "available" && (phonenumber.calls > item.callsReceived ) ) {
                console.log("phonenumber:", item.phoneNumber); 
                phonenumber = {
                    number: item.phoneNumber,
                    calls: item.callsReceived
                }
            }
        }
    }
    
    const VoiceResponse = require('twilio').twiml.VoiceResponse;
    const response = new VoiceResponse();
    const dial = response.dial();
    console.log(phonenumber);
    dial.number({
            statusCallback: 'https://callhunt-9222-dev.twil.io/statusCallbackandUpdateSyncItem', // listen to accepted and hangup to update sync map status and callsReceived
            statusCallbackEvent: 'answered completed',
            statusCallbackMethod: 'POST'
        }, phonenumber.number);
        console.log(response.toString());
    
	callback(null, response);
}

async function readSyncList() {
    try {
        let data = await client.sync
              .services(syncServiceSid)
              .syncLists(syncList)
              .syncListItems
              .list({limit: 20});
        return data
    } catch (e) {
        // log error
        return false;
        
    }
    
}
