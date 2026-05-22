import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Ticket, TicketType, TicketStatus } from '../models/ticket.model';
import { QueueState } from '../models/queue.model';

@Injectable({ providedIn: 'root' })
export class QueueService {

  // Sequência diária por tipo (reinicia ao abrir expediente)
  private sequences: Record<TicketType, number> = {
    [TicketType.SP]: 0,
    [TicketType.SG]: 0,
    [TicketType.SE]: 0
  };

  // Todos os tickets do dia (para relatórios)
  private allTickets: Ticket[] = [];

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

  // ─── Expediente ───────────────────────────────────────────────────────────

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
    // Senhas restantes são descartadas
    [...this.state.spQueue, ...this.state.seQueue, ...this.state.sgQueue].forEach(t => {
      t.status = TicketStatus.DISCARDED;
    });
    this.state.spQueue = [];
    this.state.seQueue = [];
    this.state.sgQueue = [];
    this.state.isOpen = false;
    this.emit();
  }

  // ─── Emissão de Senha (Agente Cliente — Totem) ────────────────────────────

  issueTicket(type: TicketType): Ticket | null {
    if (!this.state.isOpen) return null;

    this.sequences[type]++;
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const sq = String(this.sequences[type]).padStart(3, '0');

    const ticket: Ticket = {
      id: `${yy}${mm}${dd}-${type}${sq}`,
      type,
      sequence: this.sequences[type],
      issuedAt: now,
      status: TicketStatus.WAITING
    };

    // 5% de desistência do cliente (AC) — descartado sem SA
    if (Math.random() < 0.05) {
      ticket.status = TicketStatus.DISCARDED;
      this.allTickets.push(ticket);
      this.emit();
      return ticket;
    }

    // Insere na fila correta
    if (type === TicketType.SP) this.state.spQueue.push(ticket);
    else if (type === TicketType.SG) this.state.sgQueue.push(ticket);
    else this.state.seQueue.push(ticket);

    this.allTickets.push(ticket);
    this.emit();
    return ticket;
  }

  // ─── Chamada de Próxima Senha (Agente Atendente) ──────────────────────────
  // Regra: [SP] → [SE|SG] → [SP] → [SE|SG] …
  // SP tem prioridade máxima; SE vem após SP; SG tem menor prioridade.

  callNext(desk: number): Ticket | null {
    if (!this.state.isOpen) return null;

    let next: Ticket | undefined;
    const last = this.state.lastCalledType;

    if (last !== TicketType.SP && this.state.spQueue.length > 0) {
      // Se a última não foi SP e há SP na fila, chama SP
      next = this.state.spQueue.shift();
    } else if (this.state.seQueue.length > 0) {
      // Após SP (ou sem SP): chama SE se disponível
      next = this.state.seQueue.shift();
    } else if (this.state.sgQueue.length > 0) {
      // Sem SE: chama SG
      next = this.state.sgQueue.shift();
    } else if (this.state.spQueue.length > 0) {
      // Só há SP na fila
      next = this.state.spQueue.shift();
    }

    if (!next) return null;

    next.status   = TicketStatus.IN_SERVICE;
    next.calledAt = new Date();
    next.desk     = desk;

    this.state.lastCalledType = next.type;
    this.state.currentTicket  = next;

    // Mantém a senha atual + as 5 últimas no histórico (total 6 itens)
    this.state.lastCalledTickets.unshift(next);
    if (this.state.lastCalledTickets.length > 6) {
      this.state.lastCalledTickets.pop();
    }

    this.emit();
    return next;
  }

  // ─── Finalizar Atendimento ────────────────────────────────────────────────

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

  // ─── Tempo Médio de Atendimento (TM) ─────────────────────────────────────
  // SP: 15 min ± 5 min aleatório (igual distribuição)
  // SG:  5 min ± 3 min aleatório (igual distribuição)
  // SE: 1 min para 95% dos SA | 5 min para 5% dos SA

  private calcServiceTime(type: TicketType): number {
    if (type === TicketType.SP) {
      const variation = Math.floor(Math.random() * 11) - 5; // -5 a +5
      return 15 + variation;
    }
    if (type === TicketType.SG) {
      const variation = Math.floor(Math.random() * 7) - 3;  // -3 a +3
      return 5 + variation;
    }
    // SE
    return Math.random() < 0.95 ? 1 : 5;
  }

  // ─── Relatórios ───────────────────────────────────────────────────────────

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

  // ─── Interno ─────────────────────────────────────────────────────────────

  private emit(): void {
    this.stateSubject.next({
      ...this.state,
      spQueue: [...this.state.spQueue],
      sgQueue: [...this.state.sgQueue],
      seQueue: [...this.state.seQueue],
      lastCalledTickets: [...this.state.lastCalledTickets]
    });
  }
}
