import { Ticket, TicketType } from './ticket.model';

export interface QueueState {
  spQueue: Ticket[];
  sgQueue: Ticket[];
  seQueue: Ticket[];
  lastCalledTickets: Ticket[];   // últimas 5 chamadas para o painel
  currentTicket: Ticket | null;
  lastCalledType: TicketType | null;
  isOpen: boolean;               // expediente aberto (07h–17h)
  desks: number;                 // número de guichês disponíveis
}
