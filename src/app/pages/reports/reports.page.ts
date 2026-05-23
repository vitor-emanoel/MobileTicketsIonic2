import { Component, OnInit } from '@angular/core';
import { QueueService } from '../../services/queue.service';
import { Ticket, TicketType, TicketStatus } from '../../models/ticket.model';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss']
})
export class ReportsPage implements OnInit {
  ticketTypeEnum = TicketType;

  tickets: Ticket[] = [];
  today: Date = new Date();
  
  detailedReport: any[] = [];
  monthlyReport: any[] = [];

  constructor(private queueService: QueueService) {}

  ngOnInit() {
    this.loadReport();
  }

  loadReport(): void {
    this.tickets = this.queueService.getAllTickets();
    this.today = new Date();

    const historicoSalvo = JSON.parse(localStorage.getItem('all_tickets_history') || '[]');
    const todosOsTickets = [...historicoSalvo, ...this.tickets];

    this.detailedReport = todosOsTickets.map(ticket => {
      const isAttended = ticket.status === TicketStatus.COMPLETED || ticket.status === TicketStatus.IN_SERVICE;
      return {
        numeracao: ticket.id,
        tipo: ticket.type,
        dataHoraEmissao: ticket.issuedAt,
        dataHoraAtendimento: isAttended ? ticket.calledAt : '',
        guicheResponsavel: isAttended ? ticket.desk : ''
      };
    });

    // Gera o relatório mensal usando a base histórica total de meses anteriores
    this.monthlyReport = this.queueService.getMonthlyReport(); 
  }

  get totalEmitidas(): number {
    return this.tickets.length;
  }

  get totalAtendidas(): number {
    return this.tickets.filter(t => t.status === TicketStatus.COMPLETED).length;
  }

  get totalDescartadas(): number {
    return this.tickets.filter(t => t.status === TicketStatus.DISCARDED).length;
  }

  emitidas(type: string): number {
    return this.tickets.filter(t => t.type === type).length;
  }

  atendidas(type: string): number {
    return this.tickets.filter(
      t => t.type === type && t.status === TicketStatus.COMPLETED
    ).length;
  }

  tmMedio(type: any): number {
    return this.queueService.getAverageServiceTime(type);
  }

  badgeColor(status: TicketStatus): string {
    const map: Record<TicketStatus, string> = {
      [TicketStatus.WAITING]:    'primary',
      [TicketStatus.IN_SERVICE]: 'warning',
      [TicketStatus.COMPLETED]:  'success',
      [TicketStatus.DISCARDED]:  'medium'
    };
    return map[status] ?? 'medium';
  }

  typeColor(type: TicketType): string {
    const map: Record<TicketType, string> = {
      [TicketType.SP]: 'danger',
      [TicketType.SG]: 'primary',
      [TicketType.SE]: 'success'
    };
    return map[type] ?? 'medium';
  }
}