export enum TicketType {
  SP = 'SP', // Senha Prioritária
  SG = 'SG', // Senha Geral
  SE = 'SE'  // Senha Exames
}

export enum TicketStatus {
  WAITING    = 'AGUARDANDO',
  IN_SERVICE = 'EM ATENDIMENTO',
  COMPLETED  = 'CONCLUÍDO',
  DISCARDED  = 'DESCARTADO'
}

export interface Ticket {
  id: string;           // Formato: YYMMDD-PPSQ
  type: TicketType;
  sequence: number;
  issuedAt: Date;
  calledAt?: Date;
  completedAt?: Date;
  desk?: number;
  status: TicketStatus;
  serviceTime?: number; // em minutos
}
