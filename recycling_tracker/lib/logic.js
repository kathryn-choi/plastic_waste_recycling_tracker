/* eslint-disable semi */
/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * CreateTicket transaction
 * @param {org.recycling.tracker.CreateTicket} createTicket
 * @transaction
 */
async function CreateTicket(createTicket) {
    const ticketRegistry = await getAssetRegistry('org.recycling.tracker.Ticket');
    const factory = getFactory();
    const ticket = factory.newResource('org.recycling.tracker', 'Ticket', createTicket.ticket_id);
    ticket.currentdes = createTicket.currentdes;
    ticket.previousdes = createTicket.previousdes;
    ticket.weight = createTicket.weight;
    ticket.transfer_date = createTicket.transfer_date;
    ticket.giver = createTicket.giver;
    ticket.reciever = createTicket.reciever;
    ticket.conveyancer = createTicket.conveyancer;
    ticket.pre_convey_count = createTicket.pre_convey_count;
    ticket.cur_convey_count = createTicket.cur_convey_count;
    ticket.waste_index = createTicket.waste_index;
    await ticketRegistry.add(ticket);
    const event = getFactory().newEvent('org.recycling.tracker', 'ticket_created');
	  event.ticket_id = ticket.ticket_id
  	event.currentdes = ticket.currentdes
    event.previousdes = ticket.previousdes
    event.transfer_date = ticket.transfer_date
    event.weight = ticket.weight
    event.giver = ticket.giver
  	event.reciever = ticket.reciever
    event.conveyancer = ticket.conveyancer
    event.pre_convey_count=ticket.pre_convey_count
    event.cur_convey_count=ticket.cur_convey_count
    event.waste_index=ticket.waste_index
  	emit(event)

}

/**
 * DeleteTicket transaction
 * @param {org.recycling.tracker.DeleteTicket} deleteTicket
 * @transaction
 */
async function DeleteTicket(deleteTicket) {
    const ticketRegistry = await getAssetRegistry('org.recycling.tracker.Ticket')

    await ticketRegistry.remove(deleteTicket.ticket);

    const event = getFactory().newEvent('org.recycling.tracker', 'ticket_deleted');
	  event.ticket_id = deleteTicket.ticket.ticket_id
  	event.currentdes = deleteTicket.ticket.currentdes
    event.previousdes = deleteTicket.ticket.previousdes
    event.weight = deleteTicket.ticket.weight
    event.transfer_date = deleteTicket.ticket.transfer_date
    event.giver = deleteTicket.ticket.giver
  	event.reciever = deleteTicket.ticket.reciever
    event.conveyancer = deleteTicket.ticket.conveyancer
    event.pre_convey_count = deleteTicket.ticket.pre_convey_count
    event.cur_convey_count=deleteTicket.ticket.cur_convey_count
    event.waste_index=deleteTicket.ticket.waste_index
    emit(event)
}

/**
 * ChangeTicketInfo transaction
 * @param {org.recycling.tracker.ChangeTicketInfo} changeTicketinfo
 * @transaction
 */
async function ChangeTicketInfo(changeTicketinfo) {
    const ticketRegistry = await getAssetRegistry('org.recycling.tracker.Ticket');
    changeTicketinfo.ticket.currentdes = changeTicketinfo.currentdes;
    changeTicketinfo.ticket.previousdes = changeTicketinfo.previousdes;
    changeTicketinfo.ticket.weight = changeTicketinfo.weight;
    changeTicketinfo.ticket.transfer_date = changeTicketinfo.transfer_date;
    changeTicketinfo.ticket.giver = changeTicketinfo.giver;
    changeTicketinfo.ticket.reciever = changeTicketinfo.reciever;
    changeTicketinfo.ticket.conveyancer = changeTicketinfo.conveyancer;
    changeTicketinfo.ticket.pre_convey_count = changeTicketinfo.pre_convey_count;
    changeTicketinfo.ticket.cur_convey_count = changeTicketinfo.cur_convey_count;
    changeTicketinfo.ticket.waset_index = changeTicketinfo.waset_index;

    await ticketRegistry.update(changeTicketinfo.ticket);

    const event = getFactory().newEvent('org.recycling.tracker', 'ticket_updated');
	  event.ticket_id = changeTicketinfo.ticket.ticket_id
  	event.currentdes = changeTicketinfo.ticket.currentdes
    event.previousdes = changeTicketinfo.ticket.previousdes
    event.weight = changeTicketinfo.ticket.weight
    event.transfer_date = changeTicketinfo.ticket.transfer_date
    event.giver = changeTicketinfo.ticket.giver
  	event.reciever = changeTicketinfo.ticket.reciever
    event.conveyancer = changeTicketinfo.ticket.conveyancer
    event.cur_convey_count = changeTicketinfo.ticket.cur_convey_count
    event.pre_convey_count = changeTicketinfo.ticket.pre_convey_count
    event.waste_index = changeTicketinfo.ticket.waste_index
    emit(event)

}

/**
 * createCompasset transaction
 * @param {org.recycling.tracker.CreateCompasset} createCompasset
 * @transaction
 */
async function CreateCompasset(createCompasset) {
  const compassetRegistry = await getAssetRegistry('org.recycling.tracker.Compasset');
  const factory = getFactory();
  const compasset = factory.newResource('org.recycling.tracker', 'Compasset', createCompasset.asset_id);
  compasset.gen_weight = createCompasset.gen_weight;
  compasset.handle_weight = createCompasset.handle_weight;
  compasset.save_weight = createCompasset.save_weight;
  compasset.comp_id = createCompasset.comp_id;
  compasset.waste_code = createCompasset.waste_code;
  await compassetRegistry.add(compasset);
  const event = getFactory().newEvent('org.recycling.tracker', 'compasset_create');
  event.asset_id = compasset.asset_id;
  event.gen_weight = compasset.gen_weight;
  event.handle_weight = compasset.handle_weight;
  event.save_weight = compasset.save_weight;
  event.comp_id = compasset.comp_id;
  event.waste_code= compasset.waste_code;
  emit(event)

}


/**
 * UpdateCompanyAsset transaction
 * @param {org.recycling.tracker.UpdateCompanyAsset} updatecompanyasset
 * @transaction
 */
async function UpdateCompanyAsset(updatecompanyasset) {
    const ticketRegistry = await getAssetRegistry('org.recycling.tracker.Compasset');
    updatecompanyasset.compasset.gen_weight = updatecompanyasset.gen_weight;
    updatecompanyasset.compasset.handle_weight = updatecompanyasset.handle_weight;
    updatecompanyasset.compasset.save_weight = updatecompanyasset.save_weight;
    await ticketRegistry.update(updatecompanyasset.compasset);

    const event = getFactory().newEvent('org.recycling.tracker', 'compasset_update');
	  event.asset_id = updatecompanyasset.compasset.asset_id
    event.gen_weight = updatecompanyasset.compasset.gen_weight
    event.handle_weight = updatecompanyasset.compasset.handle_weight
    event.save_weight = updatecompanyasset.compasset.save_weight
    event.comp_id = updatecompanyasset.compasset.comp_id
    event.waste_code = updatecompanyasset.compasset.waste_code

    emit(event)
}
