import { Component, OnInit } from '@angular/core';
import { QueueService } from '../../services/queue.service';
import { Ticket, TicketType, TicketStatus } from '../../models/ticket.model';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss']
})
export class ReportsPage implements OnInit {
  tickets: Ticket[] = [];
  TicketType  = TicketType;
  TicketStatus = TicketStatus;
  today = new Date();

  constructor(private queueService: QueueService) {}

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    this.tickets = this.queueService.getAllTickets();
    this.today   = new Date();
  }

  // ── Quantitativos gerais ─────────────────────────────────────────────────

  get totalEmitidas(): number {
    return this.tickets.length;
  }

  get totalAtendidas(): number {
    return this.tickets.filter(t => t.status === TicketStatus.COMPLETED).length;
  }

  get totalDescartadas(): number {
    return this.tickets.filter(t => t.status === TicketStatus.DISCARDED).length;
  }

  // ── Por prioridade ────────────────────────────────────────────────────────

  emitidas(type: TicketType): number {
    return this.tickets.filter(t => t.type === type).length;
  }

  atendidas(type: TicketType): number {
    return this.tickets.filter(
      t => t.type === type && t.status === TicketStatus.COMPLETED
    ).length;
  }

  // ── TM médio por tipo ─────────────────────────────────────────────────────

  tmMedio(type: TicketType): number {
    return this.queueService.getAverageServiceTime(type);
  }

  // ── Cor do badge por status ───────────────────────────────────────────────

  badgeColor(status: TicketStatus): string {
    const map: Record<TicketStatus, string> = {
      [TicketStatus.WAITING]:    'primary',
      [TicketStatus.IN_SERVICE]: 'warning',
      [TicketStatus.COMPLETED]:  'success',
      [TicketStatus.DISCARDED]:  'medium'
    };
    return map[status] ?? 'medium';
  }

  // ── Cor do badge por tipo ─────────────────────────────────────────────────

  typeColor(type: TicketType): string {
    const map: Record<TicketType, string> = {
      [TicketType.SP]: 'danger',
      [TicketType.SG]: 'primary',
      [TicketType.SE]: 'success'
    };
    return map[type] ?? 'medium';
  }
}
