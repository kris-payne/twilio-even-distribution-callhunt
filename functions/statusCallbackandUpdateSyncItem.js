const syncServiceSid = 'IS67ac716afd95dd25575f708053702543';
const syncList ='ESfac327054a04471897b48ef4315b32e1';
var client = "";
exports.handler = async function(context, event, callback) {
    client = context.getTwilioClient();
    console.log(event.CallStatus);
	if (event.CallStatus == "in-progress") {

	let items = await readSyncList();
		let itemData = {};
     {
        for(var i in items) {
            let item = items[i];
            console.log(items); 
            if (item.data.itemData.phoneNumber == event.Called) {
                console.log("ItemIndex:", item.index);
                itemIndex = item.index;
                itemData = {
                    status: "busy",
                    phoneNumber: item.data.itemData.phoneNumber,
                    callsReceived: item.data.itemData.callsReceived,
                    name: item.data.itemData.name
                };
            }
        }
    }
        
    let updateSync = await updateSyncItem(itemIndex, itemData);
    console.log("we are here");
    
	callback(null, updateSync);
	
    }else if (event.CallStatus == "completed") {
        let items = await readSyncList();
		let itemData = {};
     {
        for(var i in items) {
            let item = items[i];
            console.log(items); 
            if (item.data.itemData.phoneNumber == event.Called) {
                console.log("ItemIndex:", item.index);
                itemIndex = item.index;
                itemCallsReceived = parseInt(item.data.itemData.callsReceived) + 1;
                itemData = {
                    status: "available",
                    phoneNumber: item.data.itemData.phoneNumber,
                    callsReceived: itemCallsReceived,
                    name: item.data.itemData.name
                };
            }
        }
    }
        let updateSync = await updateSyncItem(itemIndex, itemData);
    console.log("we are here");
    
	callback(null, updateSync);
    }
} 

async function readSyncList() {
    try {
        let data = await client.sync
              .services(syncServiceSid)
              .syncLists(syncList)
              .syncListItems
              .list({limit: 20});
        return data
    } catch (error) {
        console.log(error)
        return false;
        
    }
}

async function updateSyncItem(itemIndex, itemData) {
    try { 
        let itemUpdate = await client.sync
              .services(syncServiceSid)
              .syncLists(syncList)
              .syncListItems(itemIndex)
              .update({data: {itemData}})
        return itemUpdate
    } catch (error) {
        console.log(error)
        return false;
        
    }
}