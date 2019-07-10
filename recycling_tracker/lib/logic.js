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
    await ticketRegistry.add(ticket);
    const event = getFactory().newEvent('org.recycling.tracker', 'ticket_created');
	event.ticket_id = ticket.ticket_id
  	event.currentdes = ticket.currentdes
    event.previousdes = ticket.previousdes
    event.weight = ticket.weight
    event.giver = ticket.giver
  	event.reciever = ticket.reciever
    event.conveyancer = ticket.conveyancer
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
    event.giver = deleteTicket.ticket.giver
  	event.reciever = deleteTicket.ticket.reciever
    event.conveyancer = deleteTicket.ticket.conveyancer
    emit(event)
}

/**
 * ChangeTicketInfo transaction
 * @param {org.recycling.tracker.ChangeTicketInfo} changeTicketinfo
 * @transaction
 */
async function ChangeTicketInfo(changeticketinfo) {
    const ticketRegistry = await getAssetRegistry('org.recycling.tracker.Ticket');
    changeticketinfo.ticket.currentdes = changeTicketinfo.currentdes;
    changeticketinfo.ticket.previousdes = changeTicketinfo.previousdes;
    changeticketinfo.ticket.transfer_date = changeTicketinfo.transfer_date;
    changeticketinfo.ticket.giver = changeTicketinfo.giver;
    changeticketinfo.ticket.reciever = changeTicketinfo.reciever;
    changeticketinfo.ticket.conveyancer = changeTicketinfo.conveyancer;
    await ticketRegistry.update(changeticketinfo.ticket);

    const event = getFactory().newEvent('org.recycling.tracker', 'ticket_updated');
	event.ticket_id = changeticketinfo.ticket.ticket_id
  	event.currentdes = changeticketinfo.ticket.currentdes
    event.previousdes = changeticketinfo.ticket.previousdes
    event.weight = changeticketinfo.ticket.weight
    event.giver = changeticketinfo.ticket.giver
  	event.reciever = changeticketinfo.ticket.reciever
    event.conveyancer = changeticketinfo.ticket.conveyancer
    emit(event)

}

/**
 * UpdateCompanyAsset transaction
 * @param {org.recycling.tracker.UpdateCompanyAsset} updateCompanyasset
 * @transaction
 */
async function UpdateCompanyAsset(updatecompanyasset) {
    const ticketRegistry = await getAssetRegistry('org.recycling.tracker.Compasset');
    updatecompanyasset.compasset.gen_weight = updateCompanyasset.gen_weight;
    updatecompanyasset.compasset.handle_weight = updateCompanyasset.handle_weight;
    updatecompanyasset.compasset.save_weight = updateCompanyasset.save_weight;
    await ticketRegistry.update(updatecompanyasset.compasset);

    const event = getFactory().newEvent('org.recycling.tracker', 'compasset_update');
	event.asset_id = updatecompanyasset.compasset.asset_id
    event.gen_weight = updatecompanyasset.compasset.gen_weight
    event.handle_weight = updatecompanyasset.compasset.handle_weight
    event.save_weight = updatecompanyasset.compasset.save_weight
    event.owner = updatecompanyasset.compasset.owner
    emit(event)
}
