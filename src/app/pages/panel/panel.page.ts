import { Component, OnInit } from '@angular/core';
import { QueueService } from '../../services/queue.service';
import { QueueState } from '../../models/queue.model';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.page.html',
  styleUrls: ['./panel.page.scss']
})
export class PanelPage implements OnInit {
  state!: QueueState;

  constructor(private queueService: QueueService) {}

  ngOnInit(): void {
    this.queueService.state$.subscribe(s => (this.state = s));
  }
}
