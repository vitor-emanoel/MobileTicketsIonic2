import { Component } from '@angular/core';
import { QueueService } from '../../services/queue.service';
import { Ticket, TicketType, TicketStatus } from '../../models/ticket.model';

@Component({
  selector: 'app-totem',
  templateUrl: './totem.page.html',
  styleUrls: ['./totem.page.scss']
})
export class TotemPage {
  lastTicket: Ticket | null = null;
  TicketType = TicketType;
  TicketStatus = TicketStatus;
  isOpen = false;

  constructor(private queueService: QueueService) {
    this.queueService.state$.subscribe(s => {
      this.isOpen = s.isOpen;
    });
  }

  emit(type: TicketType): void {
  const ticket = this.queueService.issueTicket(type);

  this.lastTicket = null as any;

  setTimeout(() => {
    this.lastTicket = ticket;
  }, 50);
}
  ticketTypeLabel(type: TicketType): string {
    const labels: Record<TicketType, string> = {
      [TicketType.SP]: 'Prioritário (Idosos, Gestantes, PCD)',
      [TicketType.SG]: 'Geral (Consultas, Coletas)',
      [TicketType.SE]: 'Retirada de Exames'
    };
    return labels[type];
  }
}
