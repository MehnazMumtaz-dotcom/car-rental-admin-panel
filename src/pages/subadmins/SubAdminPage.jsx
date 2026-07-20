import React, { useEffect, useMemo, useState } from "react";
import {
  Users,
  UserCheck,
  ShieldAlert,
  History,
} from "lucide-react";

import { useSubAdminStore } from "../../store/SubAdminStore";
import { useAuthStore } from "../../store/authStore";

import CreateSubAdmin from "./CreateSubAdmin";
import RoleManagement from "./RoleManagement";
import SubAdminList from "./SubAdminList";


function StatCard({ icon: Icon, label, value, sub, tone }) {

  const tones = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    secondary: "bg-secondary/10 text-secondary",
  };


  return (
    <div className="bg-surface rounded-xl shadow-card border border-borderColor p-4 flex items-center gap-3">

      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tones[tone]}`}
      >
        <Icon size={20}/>
      </div>


      <div>

        <p
          className="text-xs font-semibold tracking-wide"
          style={{color:"#A17A4E"}}
        >
          {label}
        </p>


        <p className="text-xl font-semibold text-textPrimary">
          {value}
        </p>


        <p className="text-xs text-textSecondary">
          {sub}
        </p>

      </div>

    </div>
  );
}



const emptyForm = {
  name:"",
  email:"",
  status:"active",
  password:"",
  role:"SUB_ADMIN",
};



export default function SubAdminPage(){


  const allSubAdmins = useSubAdminStore(
    (state)=>state.subAdmins
  );


  const auditLog = useSubAdminStore(
    (state)=>state.auditLog
  );


  const createSubAdmin = useSubAdminStore(
    (state)=>state.createSubAdmin
  );


  const fetchSubAdmins = useSubAdminStore(
    (state)=>state.fetchSubAdmins
  );


  // ✅ FIX: audit logs fetch function
  const fetchAuditLog = useSubAdminStore(
    (state)=>state.fetchAuditLog
  );


  const adminCity = useAuthStore(
    (state)=>state.user?.city
  );



  // ==========================
  // INITIAL LOAD
  // ==========================

  useEffect(()=>{

    fetchSubAdmins();

    // ✅ FIX: load audit activity
    fetchAuditLog();

  },[]);






  // ==========================
  // FILTER SUB ADMINS
  // ==========================

  const subAdmins = useMemo(()=>{


    return (allSubAdmins || []).filter((admin)=>{


      const role =
        admin.role?.toLowerCase();


      return (

        (
          role === "sub_admin" ||
          role === "subadmin" ||
          role === "sub-admin"
        )

        &&

        (
          !adminCity ||
          admin.city === adminCity
        )

      );


    });


  },[allSubAdmins,adminCity]);







  // ==========================
  // STATS
  // ==========================

  const stats = useMemo(()=>{


    const total = subAdmins.length;


    const active =
      subAdmins.filter(
        (admin)=>
          admin.status?.toLowerCase()==="active"
      ).length;



    const inactive =
      subAdmins.filter(
        (admin)=>
          admin.status?.toLowerCase()!=="active"
      ).length;



    const today =
      new Date().toDateString();



    const todayActivity =
      (auditLog || []).filter((log)=>{


        if(!log.createdAt)
          return false;


        return (
          new Date(log.createdAt)
          .toDateString()===today
        );


      }).length;




    return {
      total,
      active,
      inactive,
      todayActivity,
    };


  },[subAdmins,auditLog]);







  const [formData,setFormData] =
    useState(emptyForm);



  const [selectedPermissions,setSelectedPermissions] =
    useState([]);





  const togglePermission=(key)=>{


    setSelectedPermissions((prev)=>

      prev.includes(key)

      ?

      prev.filter(
        item=>item!==key
      )

      :

      [
        ...prev,
        key
      ]

    );


  };







  const handleSubmit=async()=>{


    if(
      !formData.name.trim() ||
      !formData.email.trim()
    )
      return;



    await createSubAdmin({

      ...formData,

      city:adminCity,

      permissions:selectedPermissions,

    });
    fetchSubAdmins();
    fetchAuditLog();
    setFormData(emptyForm);
    setSelectedPermissions([]);

  };
  const handleReset=()=>{
    setFormData(emptyForm);

    setSelectedPermissions([]);

  };

  return (

    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6">


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">


        <StatCard
          icon={Users}
          label="Total Sub-Admins"
          value={String(stats.total).padStart(2,"0")}
          sub="All created accounts"
          tone="primary"
        />


        <StatCard
          icon={UserCheck}
          label="Active Sub-Admins"
          value={String(stats.active).padStart(2,"0")}
          sub="Currently enabled"
          tone="success"
        />


        <StatCard
          icon={ShieldAlert}
          label="Inactive Sub-Admins"
          value={String(stats.inactive).padStart(2,"0")}
          sub="Disabled accounts"
          tone="warning"
        />


        <StatCard
          icon={History}
          label="Today's Activity"
          value={String(stats.todayActivity).padStart(2,"0")}
          sub="Audit log entries"
          tone="secondary"
        />


      </div>





      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">


        <CreateSubAdmin
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onReset={handleReset}
        />


        <RoleManagement
          selectedPermissions={selectedPermissions}
          onToggle={togglePermission}
        />


      </div>







      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">


        <div className="lg:col-span-2">

          <SubAdminList/>

        </div>





        <div className="bg-surface rounded-xl shadow-card border border-borderColor p-4 sm:p-5">


          <div className="flex items-center gap-2 mb-4">

            <History size={16}/>

            <h2 className="font-semibold text-red-600">
              Recent Activity (Audit Log)
            </h2>

          </div>




<div
  className="
    space-y-3
    max-h-80
    overflow-y-auto
    scrollbar-hide
  "
>


  {(auditLog || []).length === 0 && (

    <p className="text-xs text-textSecondary">
      No activity found
    </p>

  )}



  {(auditLog || []).map((log)=>(


    <div
      key={log.id}
      className="
        border-b
        border-borderColor
        pb-3
      "
    >

      <div className="flex justify-between items-start gap-3">


        <div>


          <p className="text-sm font-semibold text-textPrimary">

            {log.action}

            <span className="font-normal text-textSecondary">
  {" "}{log.entity}
</span>

          </p>



          <p className="text-xs text-textSecondary mt-1">

        {log.action === "CREATE" &&
  `Created ${log.targetAdmin?.name || "new sub admin"} account`
}

{log.action === "UPDATE" &&
  `Updated ${log.targetAdmin?.name || "sub admin"} information`
}

{log.action === "DELETE" &&
  `Deleted ${log.targetAdmin?.name || "sub admin"} account`
}

          </p>



          <p className="text-xs text-textSecondary mt-1">

            by {log.admin?.name || "Admin"}

          </p>


        </div>




        <span className="text-xs text-textSecondary whitespace-nowrap">

          {new Date(
            log.createdAt
          ).toLocaleString(
            "en-GB",
            {
              day:"2-digit",
              month:"2-digit",
              year:"numeric",
              hour:"2-digit",
              minute:"2-digit",
            }
          )}

        </span>


      </div>


    </div>


  ))}


</div>



        </div>



      </div>



    </div>

  );

}