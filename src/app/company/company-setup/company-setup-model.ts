import { CompanySetupFeatureModel } from './company-setup-feature-model';

export class CompanySetupModel {
  companyId: number;
  companyName: string;
  active: boolean;
  features: Array<CompanySetupFeatureModel>;
}



