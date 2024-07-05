// repository/ticketRepository.js
import { ticketModel } from "../dao/models/ticket.js";

class TicketRepository {
    async createTicket(ticketData) {
        try {
            return await ticketModel.create(ticketData);
        } catch (error) {
            console.log('TicketRepository.createTicket => ', error);
            throw error;
        }
    }
}

export default new TicketRepository();
