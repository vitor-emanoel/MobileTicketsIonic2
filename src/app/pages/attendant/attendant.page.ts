import { Component, OnInit } from '@angular/core';
import { QueueService } from '../../services/queue.service';
import { QueueState } from '../../models/queue.model';
import { Ticket, TicketStatus } from '../../models/ticket.model';

@Component({
  selector: 'app-attendant',
  templateUrl: './attendant.page.html',
  styleUrls: ['./attendant.page.scss']
})
export class AttendantPage implements OnInit {
  state!: QueueState;
  currentDesk = 1;
  TicketStatus = TicketStatus;

  constructor(private queueService: QueueService) {}

  ngOnInit(): void {
    this.queueService.state$.subscribe(s => (this.state = s));
  }

  openDay(): void {
    this.queueService.openDay();
  }

  closeDay(): void {
    this.queueService.closeDay();
  }

  callNext(): void {
    this.queueService.callNext(this.currentDesk);
  }

  finish(ticket: Ticket): void {
    this.queueService.finishService(ticket.id);
  }

  get totalInQueue(): number {
    if (!this.state) return 0;
    return this.state.spQueue.length + this.state.sgQueue.length + this.state.seQueue.length;
  }
}
