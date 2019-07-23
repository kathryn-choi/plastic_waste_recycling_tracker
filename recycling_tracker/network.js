/* eslint-disable eqeqeq */
/* eslint-disable require-jsdoc */
/* eslint-disable strict */
const AdminConnection = require('composer-admin').AdminConnection;
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const { BusinessNetworkDefinition, CertificateUtil, IdCard } = require('composer-common');

//declate namespace
const namespace = 'org.recycling.tracker';

//in-memory card store for testing so cards are not persisted to the file system
const cardStore = require('composer-common').NetworkCardStoreManager.getCardStore( { type: 'composer-wallet-inmemory' } );

//admin connection to the blockchain, used to deploy the business network
let adminConnection;

//this is the business network connection the tests will use.
let businessNetworkConnection;

let businessNetworkName = 'recycling_tracker';
let factory;


/*
 * Import card for an identity
 * @param {String} cardName The card name to use for this identity
 * @param {Object} identity The identity details
 */
async function importCardForIdentity(cardName, identity) {
    //use admin connection
    adminConnection = new AdminConnection();
    businessNetworkName = 'recycling_tracker';

    //declare metadata
    const metadata = {
        userName: identity.userID,
        version: 1,
        enrollmentSecret: identity.userSecret,
        businessNetwork: businessNetworkName
    };

    //get connectionProfile from json, create Idcard
    const connectionProfile = require('./local_connection.json');
    const card = new IdCard(metadata, connectionProfile);

    //import card
    await adminConnection.importCard(cardName, card);
}


//export module
module.exports = {

    /*
  * Create Emitter participant and import card for identity
  * @param {String} user_id Import user id for emitter & as identifier on network
  * @param {String} user_name Emitter name
  * @param {String} compname Emitter company name
  */
    register_emitter: async function (user_id, user_name,compname) {
        try {

            //connect as admin
            var businessNetworkConnection = new BusinessNetworkConnection();
            await businessNetworkConnection.connect('admin@recycling_tracker');

            //get the factory for the business network
            var factory = businessNetworkConnection.getBusinessNetwork().getFactory();

            //create emitter participant
            const emitter = factory.newResource(namespace, 'Emitter', user_id);
            emitter.user_name = user_name;
            emitter.company_name = compname;

            //add emitter participant
            const participantRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Emitter');
            await participantRegistry.add(emitter);

            //issue identity
            const identity = await businessNetworkConnection.issueIdentity(namespace + '.Emitter#' + user_id, user_id);

            //import card for identity
            await importCardForIdentity(user_id, identity);

            //disconnect
            await businessNetworkConnection.disconnect('admin@recycling_tracker');

            return true;
        }
        catch(err) {
            //print and return error
            console.log(err);
            var error = {};
            error.error = err.message;
            return error;
        }

    },

    /*
  * Create System Admin participant and import card for identity
  * @param {String} user_id Import user id for admin & as identifier on network
  * @param {String} user_name System Admin name
  */
    register_admin: async function (user_id, user_name) {
        try {

            //connect as admin
            var businessNetworkConnection = new BusinessNetworkConnection();
            await businessNetworkConnection.connect('admin@recycling_tracker');

            //get the factory for the business network.
            var factory = businessNetworkConnection.getBusinessNetwork().getFactory();

            //create partner participant
            const system_admin = factory.newResource(namespace, 'SysAdmin', user_id);
            system_admin.user_name = user_name;

            //add partner participant
            const participantRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.SysAdmin');
            await participantRegistry.add(system_admin);

            //issue identity
            const identity = await businessNetworkConnection.issueIdentity(namespace + '.SysAdmin#' + user_id, user_id);

            //import card for identity
            await importCardForIdentity(user_id, identity);

            //disconnect
            await businessNetworkConnection.disconnect('admin@recycling_tracker');

            return true;
        }
        catch(err) {
            //print and return error
            console.log(err);
            var error = {};
            error.error = err.message;
            return error;
        }

    },

    /*
  * Create conveyancer participant and import card for identity
  * @param {String} user_id Import user id for conveyancer & as identifier on network
  * @param {String} user_name conveyancer name
  * @param {String} carnum conveyancer car number
  */
    register_conveyancer: async function (user_id, user_name,carnum) {
        try {

            //connect as admin
            var businessNetworkConnection = new BusinessNetworkConnection();
            await businessNetworkConnection.connect('admin@recycling_tracker');

            //get the factory for the business network
            var factory = businessNetworkConnection.getBusinessNetwork().getFactory();

            //create conveyancer participant
            const conveyancer = factory.newResource(namespace, 'Conveyancer', user_id);
            conveyancer.user_name = user_name;
            conveyancer.carnumber = carnum;

            //add conveyancer participant
            const participantRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Conveyancer');
            await participantRegistry.add(conveyancer);

            //issue identity
            const identity = await businessNetworkConnection.issueIdentity(namespace + '.Conveyancer#' + user_id, user_id);

            //import card for identity
            await importCardForIdentity(user_id, identity);

            //disconnect
            await businessNetworkConnection.disconnect('admin@recycling_tracker');

            return true;
        }
        catch(err) {
            //print and return error
            console.log(err);
            var error = {};
            error.error = err.message;
            return error;
        }

    },

    /*
  * Create Handler participant and import card for identity
  * @param {String} user_id Import user id for handler & as identifier on network
  * @param {String} user_name Handler name
  * @param {String} compname Handler company name
  */
    register_handler: async function (user_id, user_name,compname) {
        try {

            //connect as admin
            var businessNetworkConnection = new BusinessNetworkConnection();
            await businessNetworkConnection.connect('admin@recycling_tracker');

            //get the factory for the business network
            var factory = businessNetworkConnection.getBusinessNetwork().getFactory();

            //create handler participant
            const handler = factory.newResource(namespace, 'Handler', user_id);
            handler.user_name = user_name;
            handler.company_name = compname;

            //add handler participant
            const participantRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Handler');
            await participantRegistry.add(handler);

            //issue identity
            const identity = await businessNetworkConnection.issueIdentity(namespace + '.Handler#' + user_id, user_id);

            //import card for identity
            await importCardForIdentity(user_id, identity);

            //disconnect
            await businessNetworkConnection.disconnect('admin@recycling_tracker');

            return true;
        }
        catch(err) {
            //print and return error
            console.log(err);
            var error = {};
            error.error = err.message;
            return error;
        }

    },

    /*
  * Create Recycler participant and import card for identity
  * @param {String} user_id Import user id for recycler & as identifier on network
  * @param {String} user_name recycler name
  * @param {String} compname recycler company name
  */
    register_recycler: async function (user_id, user_name,compname) {
        try {

            //connect as admin
            var businessNetworkConnection = new BusinessNetworkConnection();
            await businessNetworkConnection.connect('admin@recycling_tracker');

            //get the factory for the business network
            var factory = businessNetworkConnection.getBusinessNetwork().getFactory();

            //create recycler participant
            const recycler = factory.newResource(namespace, 'Recycler', user_id);
            recycler.user_name = user_name;
            recycler.company_name = compname;

            //add recycler participant
            const participantRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Recycler');
            await participantRegistry.add(recycler);

            //issue identity
            const identity = await businessNetworkConnection.issueIdentity(namespace + '.Recycler#' + user_id, user_id);

            //import card for identity
            await importCardForIdentity(user_id, identity);

            //disconnect
            await businessNetworkConnection.disconnect('admin@recycling_tracker');

            return true;
        }
        catch(err) {
            //print and return error
            console.log(err);
            var error = {};
            error.error = err.message;
            return error;
        }

    },

    create_ticket: async function (ticket_id,currentdes,previousdes,weight,transfer_date,giver_id, giver_type,reciever_id,reciever_type,conveyer_id) {
        try {
            //connect to network with user_id
            var businessNetworkConnection = new BusinessNetworkConnection();
            await businessNetworkConnection.connect('admin@recycling_tracker');

            //get the factory for the business network.
            var factory = businessNetworkConnection.getBusinessNetwork().getFactory();

            //create transaction
            const createTicket = factory.newTransaction(namespace, 'CreateTicket');
            createTicket.ticket_id = ticket_id;
            createTicket.currentdes = currentdes;
            createTicket.previousdes = previousdes;
            createTicket.transfer_date = transfer_date;
            createTicket.weight = weight;
            if(giver_type == 'emitter'){
                createTicket.giver = factory.newRelationship(namespace, 'Emitter', giver_id);
            }
            else if(giver_type == 'handler'){
                createTicket.giver = factory.newRelationship(namespace, 'Handler', giver_id);
            }

            if(reciever_type == 'handler'){
                createTicket.reciever = factory.newRelationship(namespace, 'Handler', reciever_id);
            }
            else if(reciever_type == 'recycler'){
                createTicket.reciever = factory.newRelationship(namespace, 'Recycler', reciever_id);
            }

            createTicket.conveyancer = factory.newRelationship(namespace, 'Conveyancer', conveyer_id);

            console.log('before submit transaction');
            //submit transaction
            await businessNetworkConnection.submitTransaction(createTicket);
            console.log('complete submit transaction');
            //disconnect
            await businessNetworkConnection.disconnect('admin@recycling_tracker');

            return true;
        }
        catch(err) {
            //print and return error
            console.log(err);
            var error = {};
            error.error = err.message;

            return false;
        }

    },

    change_ticket_info: async function (ticket_id,currentdes,previousdes,transfer_date,weight,giver_id, giver_type,reciever_id,reciever_type,conveyer_id) {
        try {
            console.log("NETWORK CHANGE TICKET INFO");
            console.log(ticket_id,currentdes,previousdes,transfer_date,weight,giver_id, giver_type,reciever_id,reciever_type,conveyer_id);
            //connect to network with user_id
            var businessNetworkConnection = new BusinessNetworkConnection();
            await businessNetworkConnection.connect('admin@recycling_tracker');

            //   const ticketRegistry = await getAssetRegistry('org.ticketing.system.Ticket')
            //   ticket = await carRegistry.get(ticket_id)

            //get the factory for the business network.
            var factory = businessNetworkConnection.getBusinessNetwork().getFactory();

            //create transaction
            const update_info = factory.newTransaction(namespace, 'ChangeTicketInfo');
            update_info.ticket = factory.newRelationship(namespace, 'Ticket', ticket_id);
            console.log(update_info.ticket)
            update_info.currentdes = currentdes;
            update_info.previousdes = previousdes;
            update_info.transfer_date = transfer_date;
            update_info.weight = weight;

            if(giver_type == 'emitter'){
                update_info.giver = factory.newRelationship(namespace, 'Emitter', giver_id);
            }
            else if(giver_type == 'handler'){
                update_info.giver = factory.newRelationship(namespace, 'Handler', giver_id);
            }

            if(reciever_type == 'handler'){
                update_info.reciever = factory.newRelationship(namespace, 'Handler', reciever_id);
            }
            else if(reciever_type == 'recycler'){
                update_info.reciever = factory.newRelationship(namespace, 'Recycler', reciever_id);
            }

            update_info.conveyancer = factory.newRelationship(namespace, 'Conveyancer', conveyer_id);
            console.log(update_info.reciever);
            console.log("before trans")
            //submit transaction
            await businessNetworkConnection.submitTransaction(update_info);
            console.log("complete trans")
            //disconnect
            await businessNetworkConnection.disconnect('admin@recycling_tracker');

            return true;
        }
        catch(err) {
            //print and return error
            console.log(err);
            var error = {};
            error.error = err.message;
            return error;
        }

    },

    delete_ticket: async function (ticket_id) {
        try {
            //connect to network with user_id
            var businessNetworkConnection = new BusinessNetworkConnection();
            await businessNetworkConnection.connect('admin@recycling_tracker');

            //get the factory for the business network.
            var factory = businessNetworkConnection.getBusinessNetwork().getFactory();

            //create transaction
            const deleteTicket = factory.newTransaction(namespace, 'DeleteTicket');


            deleteTicket.ticket = factory.newRelationship(namespace, 'Ticket', ticket_id);

            //submit transaction
            await businessNetworkConnection.submitTransaction(deleteTicket);

            //disconnect
            await businessNetworkConnection.disconnect('admin@recycling_tracker');

            return true;
        }
        catch(err) {
            //print and return error
            console.log(err);
            var error = {};
            error.error = err.message;
            return error;
        }

    },
    create_compasset: async function (asset_id,gen_weight,save_weight, handle_weight,comp_id, waste_code) {
        try {
            //connect to network with user_id
            var businessNetworkConnection = new BusinessNetworkConnection();
            await businessNetworkConnection.connect('admin@recycling_tracker');

            //get the factory for the business network.
            var factory = businessNetworkConnection.getBusinessNetwork().getFactory();

            //create transaction
            const createAsset = factory.newTransaction(namespace, 'CreateCompasset');
            createAsset.asset_id = asset_id;
            createAsset.gen_weight = gen_weight;
            createAsset.save_weight = save_weight;
            createAsset.handle_weight = handle_weight;
            createAsset.comp_id = comp_id;
            createAsset.waste_code = waste_code;

            console.log('before submit transaction');
            //submit transaction
            await businessNetworkConnection.submitTransaction(createAsset);
            console.log('complete submit transaction');
            //disconnect
            await businessNetworkConnection.disconnect('admin@recycling_tracker');

            return true;
        }
        catch(err) {
            //print and return error
            console.log(err);
            var error = {};
            error.error = err.message;

            return false;
        }

    },
    update_company_asset: async function (asset_id,gen_weight, handle_weight, save_weight) {
        try {

            //connect to network with user_id
            var businessNetworkConnection = new BusinessNetworkConnection();
            await businessNetworkConnection.connect('admin@recycling_tracker');

            //   const ticketRegistry = await getAssetRegistry('org.ticketing.system.Ticket')
            //   ticket = await carRegistry.get(ticket_id)

            //get the factory for the business network.
            var factory = businessNetworkConnection.getBusinessNetwork().getFactory();

            //create transaction
            const update_asset = factory.newTransaction(namespace, 'UpdateCompanyAsset');
            update_asset.compasset = factory.newRelationship(namespace, 'Compasset', asset_id);
            console.log(save_weight)
            update_asset.gen_weight = gen_weight.toString();
            update_asset.handle_weight = handle_weight.toString();
            update_asset.save_weight = save_weight.toString();

            console.log(update_asset.save_weight)

            console.log("1")
            //submit transaction
            await businessNetworkConnection.submitTransaction(update_asset);
            console.log("2")
            //disconnect
            await businessNetworkConnection.disconnect('admin@recycling_tracker');

            return true;
        }
        catch(err) {
            //print and return error
            console.log(err);
            var error = {};
            error.error = err.message;
            return error;
        }

    },

    get_buyer_data: async function (user_id) {

        try {

            //connect to network with user_id
            var businessNetworkConnection = new BusinessNetworkConnection();
            await businessNetworkConnection.connect('admin@recycling_tracker');

            //get buyer from the network
            const buyerRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Buyer');
            const buyer = await buyerRegistry.get(user_id);

            //disconnect
            await businessNetworkConnection.disconnect('admin@recycling_tracker');

            //return buyer object
            return buyer;
        }
        catch(err) {
            //print and return error
            console.log(err);
            var error = {};
            error.error = err.message;
            return error;
        }
    },
    get_ticket_info_by_id : async function (ticket_id) {

        try {
            //connect to network with user_id
            var businessNetworkConnection = new BusinessNetworkConnection();
            await businessNetworkConnection.connect('admin@recycling_tracker');

            //query ticket from the network
            const ticket = await businessNetworkConnection.query('select_ticket', {ticket_id: ticket_id});

            //disconnect
            await businessNetworkConnection.disconnect('admin@recycling_tracker');

            //return ticket object
            return ticket;
        }
        catch(err) {
            //print and return error
            console.log(err);
            var error = {};
            error.error = err.message;
            return error;
        }
    },
    get_ticket_info_by_userid : async function (_user_id,type) {

        try {
            //connect to network with user_id
            var businessNetworkConnection = new BusinessNetworkConnection();
            await businessNetworkConnection.connect('admin@recycling_tracker');
            var query_select = ' ';
            if(type == 'Emitter'){
                query_select = 'resource:'+namespace+'.Emitter#'+_user_id;
            }
            else if (type == 'Conveyancer'){
                query_select = 'resource:'+namespace+'.Conveyancer#'+_user_id;
            }
            else if (type == 'Handler'){
                query_select = 'resource:'+namespace+'.Handler#'+_user_id;
            }
            else if (type == 'Recycler'){
                query_select = 'resource:'+namespace+'.Recycler#'+_user_id;
            }
            //query ticket from the network
            const ticket = await businessNetworkConnection.query('select_ticket_by_user', {user_id: query_select});

            //disconnect
            await businessNetworkConnection.disconnect('admin@recycling_tracker');

            //return ticket object
            return ticket;
        }
        catch(err) {
            //print and return error
            console.log(err);
            var error = {};
            error.error = err.message;
            return error;
        }
    },
    get_ticket_user_received : async function (_user_id) {

        try {
            //connect to network with user_id
            var businessNetworkConnection = new BusinessNetworkConnection();
            await businessNetworkConnection.connect('admin@recycling_tracker');

            //query my ticket from the network
            const my_tickets = await businessNetworkConnection.query('select_ticket_user_received', {user_id: _user_id});

            //disconnect
            await businessNetworkConnection.disconnect('admin@recycling_tracker');

            //return ticket object
            return my_tickets;
        }
        catch(err) {
            //print and return error
            console.log(err);
            var error = {};
            error.error = err.message;
            return error;
        }
    },
    get_compasset_info_by_id : async function (asset_id) {

        try {
            //connect to network with user_id
            var businessNetworkConnection = new BusinessNetworkConnection();
            await businessNetworkConnection.connect('admin@recycling_tracker');

            //query ticket from the network
            const compasset = await businessNetworkConnection.query('select_compasset', {asset_id: asset_id});

            //disconnect
            await businessNetworkConnection.disconnect('admin@recycling_tracker');

            //return ticket object
            return compasset;
        }
        catch(err) {
            //print and return error
            console.log(err);
            var error = {};
            error.error = err.message;
            return error;
        }
    },
    get_compasset_by_user : async function (_user_id,type) {

        try {
            //connect to network with user_id
            var businessNetworkConnection = new BusinessNetworkConnection();
            await businessNetworkConnection.connect('admin@recycling_tracker');
            //get buyer from the network
            // const buyerRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Buyer');
            // const buyer = await buyerRegistry.get(user_id);

            //query all tickets from the network
            console.log('user_id:',_user_id);
            var query_select = ' ';
            if(type == 'emitter'){
                query_select = 'resource:'+namespace+'.Emitter#'+_user_id;
            }
            else if (type == 'conveyancer'){
                query_select = 'resource:'+namespace+'.Conveyancer#'+_user_id;
            }
            else if (type == 'handler'){
                query_select = 'resource:'+namespace+'.Handler#'+_user_id;
            }
            else if (type == 'recycler'){
                query_select = 'resource:'+namespace+'.Recycler#'+_user_id;
            }
            //console.log(query_select)
            var allTickets = await businessNetworkConnection.query('select_compasset_by_user', {owner_id: query_select});
            //console.log(allTickets)
            //disconnect
            await businessNetworkConnection.disconnect('admin@recycling_tracker');
            //return all tickets object
            return allTickets;
        }
        catch(err) {
            //print and return error
            console.log(err);
            var error = {};
            error.error = err.message;
            return error;
        }
    }
};
