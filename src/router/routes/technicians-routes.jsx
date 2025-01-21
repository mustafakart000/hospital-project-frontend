import React from "react";
import PrivateRoute from "../private-route";
import { config } from "../../helpers/config";
import TechniciansMainDashboard from "../../components/technicians/technicians-main-dashboard";
import TechniciansProfile from "../../components/technicians/TechniciansProfile";
import LabResults from "../../components/technicians/LabResults";
import LabResultsView from "../../components/technicians/LabResultsView";

const TechniciansRoutes = [
    {
        path: "",
        element: (
          <PrivateRoute roles={config.pageRoles.techniciansManagement}>
            <TechniciansMainDashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "technician-profile",
        element: (
          <PrivateRoute roles={config.pageRoles.techniciansManagement}>
            <TechniciansProfile />
          </PrivateRoute>
        ),
      },
      {
        path: "lab-results",
        element: (
          <PrivateRoute roles={config.pageRoles.techniciansManagement}>
            <LabResults />
          </PrivateRoute>
        ),
      },
      {
        path: "lab-results/view",
        element: (
          <PrivateRoute roles={config.pageRoles.techniciansManagement}>
            <LabResultsView />
          </PrivateRoute>
        ),
      },
]

export default TechniciansRoutes;
