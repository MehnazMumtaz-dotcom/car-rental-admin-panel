import React, { useEffect } from "react";
import { Building2 } from "lucide-react";

import { useConfigStore } from "../../store/ConfigStore";
import { useAuthStore } from "../../store/authStore";

import StatusBadge from "../../components/ui/StatusBadge";
import Switch from "../../components/ui/Switch";


export default function CityManagement() {

  const user = useAuthStore(
    (s) => s.user
  );


  const companyId = user?.companyId;


  const configs = useConfigStore(
    (s) => s.configs
  ) || {};


  const fetchCompanyConfig = useConfigStore(
    (s) => s.fetchCompanyConfig
  );


  const updateConfig = useConfigStore(
    (s) => s.updateConfig
  );
  useEffect(() => {

    if (companyId) {

      fetchCompanyConfig(companyId);

    }

  }, [companyId, fetchCompanyConfig]);




  const companyConfig =
    configs?.[companyId] || {};



  const isActive =
    companyConfig?.active ?? true;




  const handleToggle = (value) => {

    if (!companyId) return;


    updateConfig(
      companyId,
      "active",
      value
    );

  };



  return (

    <div className="bg-surface rounded-xl shadow-card border border-borderColor p-4 sm:p-5">


      <div className="mb-4">

        <h2 className="font-bold text-textPrimary text-base sm:text-lg">
          4. Company Settings
        </h2>


        <p className="text-sm text-textSecondary mt-0.5">
          Enable or disable your company on the platform.
        </p>

      </div>




      <div className="flex items-center justify-between border border-borderColor rounded-xl p-4">


        <div className="flex items-center gap-3">


          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">

            <Building2 size={16}/>

          </div>



          <div>


     <p className="font-medium text-textPrimary">

  {companyConfig.companyName || "Company"}

</p>



            <StatusBadge
              status={
                isActive
                ? "active"
                : "inactive"
              }
            />


          </div>


        </div>




        <Switch

          checked={isActive}

          onCheckedChange={handleToggle}

        />


      </div>


    </div>

  );

}