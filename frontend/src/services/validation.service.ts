import apiClient from '../lib/api';

export interface ValidationData {
  loanId: string;
  milestoneIndex: number;
  impactDelivered: number;
  validatorSecret: string;
  proofHash?: string;
  proofImages?: string[];
  notes?: string;
}

export class ValidationService {
  async validateMilestone(data: ValidationData) {
    const response = await apiClient.post('/api/validations', data);
    return response.data;
  }

  async getLoanValidations(loanId: string) {
    const response = await apiClient.get(`/api/validations/loan/${loanId}`);
    return response.data;
  }

  async getValidatorValidations(validatorId: string) {
    const response = await apiClient.get(`/api/validations/validator/${validatorId}`);
    return response.data;
  }
}

export const validationService = new ValidationService();
