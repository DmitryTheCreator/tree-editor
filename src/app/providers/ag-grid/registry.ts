import { ModuleRegistry } from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";

export const registerAgGrid = () => {
  ModuleRegistry.registerModules([AllEnterpriseModule]);
};
