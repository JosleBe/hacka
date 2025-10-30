import apiClient from './api';

export interface CreateLoanData {
  totalAmount: number;
  numMilestones: number;
  impactDescription: string;
  impactUnit: string;
  impactTarget: number;
  borrowerSecret: string;
}

export interface Loan {
  id: string;
  loanIdOnChain: number;
  borrower: {
    id: string;
    name: string;
    stellarPublicKey: string;
  };
  totalAmount: number;
  amountReleased: number;
  numMilestones: number;
  status: string;
  impactDescription: string;
  impactUnit: string;
  impactTarget: number;
  impactAchieved: number;
  milestones: any[];
  createdAt: string;
}

export class LoanService {
  async createLoan(data: CreateLoanData) {
    const response = await apiClient.post('/api/loans', data);
    return response.data;
  }

  async getLoans(filters?: { status?: string; limit?: number; offset?: number }) {
    const response = await apiClient.get('/api/loans', { params: filters });
    return response.data;
  }

  async getLoan(loanId: string) {
    const response = await apiClient.get(`/api/loans/${loanId}`);
    return response.data;
  }

  async getUserLoans(userId: string) {
    const response = await apiClient.get(`/api/loans/user/${userId}`);
    return response.data;
  }

  async generateMilestoneQR(loanId: string, milestoneIndex: number) {
    const response = await apiClient.get(`/api/loans/${loanId}/qr/${milestoneIndex}`);
    return response.data;
  }
}

export const loanService = new LoanService();
