import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Ticket, TicketType, TicketStatus } from '../models/ticket.model';
import { QueueState } from '../models/queue.model';

@Injectable({ providedIn: 'root' })
export class QueueService {

  private sequences: Record<TicketType, number> = {
    [TicketType.SP]: 0,
    [TicketType.SG]: 0,
    [TicketType.SE]: 0
  };

  private allTickets: Ticket[] = JSON.parse(localStorage.getItem('all_tickets_history') || '[]');

  private state: QueueState = {
    spQueue: [],
    sgQueue: [],
    seQueue: [],
    lastCalledTickets: [],
    currentTicket: null,
    lastCalledType: null,
    isOpen: false,
    desks: 3
  };

  private stateSubject = new BehaviorSubject<QueueState>({ ...this.state });
  public state$ = this.stateSubject.asObservable();

  openDay(): void {
    this.sequences = {
      [TicketType.SP]: 0,
      [TicketType.SG]: 0,
      [TicketType.SE]: 0
    };
    this.allTickets = [];
    this.state = {
      spQueue: [],
      sgQueue: [],
      seQueue: [],
      lastCalledTickets: [],
      currentTicket: null,
      lastCalledType: null,
      isOpen: true,
      desks: 3
    };
    this.emit();
  }

  closeDay(): void {
    [...this.state.spQueue, ...this.state.seQueue, ...this.state.sgQueue].forEach(t => {
      t.status = TicketStatus.DISCARDED;
    });
    this.state.spQueue = [];
    this.state.seQueue = [];
    this.state.sgQueue = [];
    this.state.isOpen = false;
    this.allTickets.forEach(ticket => {
      if (ticket.status === TicketStatus.WAITING || ticket.status === TicketStatus.IN_SERVICE) {
        ticket.status = TicketStatus.DISCARDED;
      }
    });

    const historicoSalvo: Ticket[] = JSON.parse(localStorage.getItem('all_tickets_history') || '[]');
    const novoHistoricoConsolidado = [...historicoSalvo, ...this.allTickets];
    localStorage.setItem('all_tickets_history', JSON.stringify(novoHistoricoConsolidado));
    this.emit();
  }

  issueTicket(type: TicketType): Ticket | null {
    if (!this.state.isOpen) return null;

    this.sequences[type]++;
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    
    // Ajustado para 2 dígitos para cumprir o padrão YYMMDD-PPSQ do PDF
    const sq = String(this.sequences[type]).padStart(2, '0');

    const ticket: Ticket = {
      id: `${yy}${mm}${dd}-${type}${sq}`,
      type,
      sequence: this.sequences[type],
      issuedAt: now,
      status: TicketStatus.WAITING
    };

    if (Math.random() < 0.05) {
      ticket.status = TicketStatus.DISCARDED;
      this.allTickets.push(ticket);
      this.emit();
      return ticket;
    }

    if (type === TicketType.SP) this.state.spQueue.push(ticket);
    else if (type === TicketType.SG) this.state.sgQueue.push(ticket);
    else this.state.seQueue.push(ticket);

    this.allTickets.push(ticket);
    this.emit();
    return ticket;
  }

  callNext(desk: number): Ticket | null {
    if (!this.state.isOpen) return null;

    let next: Ticket | undefined;
    const last = this.state.lastCalledType;

    if (last !== TicketType.SP && this.state.spQueue.length > 0) {
      next = this.state.spQueue.shift();
    } else if (this.state.seQueue.length > 0) {
      next = this.state.seQueue.shift();
    } else if (this.state.sgQueue.length > 0) {
      next = this.state.sgQueue.shift();
    } else if (this.state.spQueue.length > 0) {
      next = this.state.spQueue.shift();
    }

    if (!next) return null;

    next.status   = TicketStatus.IN_SERVICE;
    next.calledAt = new Date();
    next.desk     = desk;

    this.state.lastCalledType = next.type;
    this.state.currentTicket  = next;

    this.state.lastCalledTickets.unshift(next);
    if (this.state.lastCalledTickets.length > 5) {
      this.state.lastCalledTickets.pop();
    }

    this.emit();
    return next;
  }

  finishService(ticketId: string): void {
    const ticket = this.allTickets.find(t => t.id === ticketId);
    if (ticket) {
      ticket.status      = TicketStatus.COMPLETED;
      ticket.completedAt = new Date();
      ticket.serviceTime = this.calcServiceTime(ticket.type);
    }
    this.state.currentTicket = null;
    this.emit();
  }

  private calcServiceTime(type: TicketType): number {
    if (type === TicketType.SP) {
      const variation = Math.floor(Math.random() * 11) - 5;
      return 15 + variation;
    }
    if (type === TicketType.SG) {
      const variation = Math.floor(Math.random() * 7) - 3;
      return 5 + variation;
    }
    return Math.random() < 0.95 ? 1 : 5;
  }

  getAllTickets(): Ticket[] {
    return [...this.allTickets];
  }

  getTicketsByType(type: TicketType): Ticket[] {
    return this.allTickets.filter(t => t.type === type);
  }

  getTicketsByStatus(status: TicketStatus): Ticket[] {
    return this.allTickets.filter(t => t.status === status);
  }

  getAverageServiceTime(type: TicketType): number {
    const completed = this.allTickets.filter(
      t => t.type === type && t.status === TicketStatus.COMPLETED && t.serviceTime !== undefined
    );
    if (!completed.length) return 0;
    const total = completed.reduce((sum, t) => sum + (t.serviceTime ?? 0), 0);
    return Math.round(total / completed.length);
  }

  private emit(): void {

    this.stateSubject.next({
      ...this.state,
      spQueue: [...this.state.spQueue],
      sgQueue: [...this.state.sgQueue],
      seQueue: [...this.state.seQueue],
      lastCalledTickets: [...this.state.lastCalledTickets]
    });
  }

  getDetailedTicketsReport() {
    return this.allTickets.map(ticket => {
      const isAttended = ticket.status === TicketStatus.COMPLETED || ticket.status === TicketStatus.IN_SERVICE;
      return {
        numeracao: ticket.id,
        tipo: ticket.type,
        dataHoraEmissao: ticket.issuedAt,
        dataHoraAtendimento: isAttended ? ticket.calledAt : '',
        guicheResponsavel: isAttended ? ticket.desk : ''
      };
    });
  }

  getMonthlyReport() {
    const report: Record<string, any> = {};

    this.allTickets.forEach(ticket => {
      const date = new Date(ticket.issuedAt);
      const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!report[yearMonth]) {
        report[yearMonth] = {
          mes: yearMonth,
          totalEmitidas: 0,
          totalAtendidas: 0,
          emitidasPorTipo: { SP: 0, SG: 0, SE: 0 },
          atendidasPorTipo: { SP: 0, SG: 0, SE: 0 }
        };
      }

      report[yearMonth].totalEmitidas++;
      report[yearMonth].emitidasPorTipo[ticket.type]++;

      if (ticket.status === TicketStatus.COMPLETED) {
        report[yearMonth].totalAtendidas++;
        report[yearMonth].atendidasPorTipo[ticket.type]++;
      }
    });

    return Object.values(report).sort((a: any, b: any) => b.mes.localeCompare(a.mes));
  }
}