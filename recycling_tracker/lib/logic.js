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
    const ticketRegistry = await getAssetRegistry('org.recycling.tracker.Ticket')
    const factory = getFactory()
    const ticket = factory.newResource('org.recycling.tracker', 'Ticket', createTicket.ticket_id)
  	ticket.currentdes = createTicket.currentdes
    ticket.previousdes = createTicket.previousdes
    ticket.weight = createTicket.weight
    ticket.giver = createTicket.giver
    ticket.reciever = createTicket.reciever
    ticket.conveyancer = createTicket.conveyancer
    await ticketRegistry.add(ticket)

}

/**
 * DeleteTicket transaction
 * @param {org.recycling.tracker.DeleteTicket} deleteTicket
 * @transaction
 */
async function DeleteTicket(deleteTicket) {
    const ticketRegistry = await getAssetRegistry('org.recycling.tracker.Ticket')

    await ticketRegistry.remove(deleteTicket.ticket)

}

/**
 * ChangeTicketInfo transaction
 * @param {org.recycling.tracker.ChangeTicketInfo} changeticketinfo
 * @transaction
 */
async function ChangeTicketInfo(changeticketinfo) {
    const ticketRegistry = await getAssetRegistry('org.recycling.tracker.Ticket')
    changeticketinfo.ticket.currentdes = changeticketinfo.currentdes
    changeticketinfo.ticket.previousdes = changeticketinfo.previousdes
    changeticketinfo.ticket.giver = changeticketinfo.giver
    changeticketinfo.ticket.reciever = changeticketinfo.reciever
    changeticketinfo.ticket.conveyancer = changeticketinfo.conveyancer
    await ticketRegistry.update(changeticketinfo.ticket)

}

/**
 * UpdateCompanyAsset transaction
 * @param {org.recycling.tracker.UpdateCompanyAsset} updatecompanyasset
 * @transaction
 */
async function UpdateCompanyAsset(updatecompanyasset) {
    const ticketRegistry = await getAssetRegistry('org.recycling.tracker.Compasset')
    updatecompanyasset.compasset.gen_weight = updatecompanyasset.gen_weight
    updatecompanyasset.compasset.handle_weight = updatecompanyasset.handle_weight
    updatecompanyasset.compasset.save_weight = updatecompanyasset.save_weight
    await ticketRegistry.update(updatecompanyasset.compasset)
}
