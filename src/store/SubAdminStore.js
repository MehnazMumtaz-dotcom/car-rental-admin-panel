import { create } from "zustand";
import { persist } from "zustand/middleware";
import SubAdminService from "../services/SubAdminService";


export const PERMISSIONS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "complaints", label: "Complaints" },
  { key: "bookingCalendar", label: "Booking Calendar" },
  { key: "customers", label: "Customers" },
  { key: "configPanel", label: "Config Panel" },
  { key: "reports", label: "Reports" },
  { key: "subAdmins", label: "Sub-Admins" },
  { key: "auditLog", label: "Audit Log" },
];



export const useSubAdminStore = create(

  persist(

    (set, get) => ({

      subAdmins: [],

      auditLog: [],

      loading: false,

      status: "idle",


      normalizeAdmin: (admin) => {

        return {

          id: admin.id || admin._id,

          name:
            admin.name ||
            admin.email ||
            "No Name",


          email:
            admin.email || "",



          status:
            admin.status?.toLowerCase() ||
            (admin.isActive
              ? "active"
              : "inactive"),



          isActive:
            admin.status?.toLowerCase() === "active" ||
            admin.isActive === true,



          permissions:
            Array.isArray(admin.permissions)
              ? admin.permissions
              : [],



          role:
            admin.role || "",



          city:
            admin.city || "",



          createdAt:
            admin.createdAt || null,


        };

      },

      fetchSubAdmins: async () => {


        try {


          set({
            loading:true
          });



          const res =
            await SubAdminService.getAll();



          console.log(
            "RAW SUB ADMINS:",
            res
          );



          let data = res;



          if(res?.data)

            data = res.data;



          if(data?.data)

            data = data.data;




          if(!Array.isArray(data)){

            data=[];

          }





          const normalized =
            data.map((item)=>

              get().normalizeAdmin(item)

            );





          set({

            subAdmins:
              normalized,

            loading:false,

          });





        }

        catch(error){


          console.error(
            "Fetch sub admins failed:",
            error
          );


          set({

            loading:false

          });


        }


      },

      createSubAdmin: async(data)=>{


        try{


          set({
            status:"saving"
          });




          await SubAdminService.create({

            ...data,

            role:"SUB_ADMIN",

          });





          await get().fetchSubAdmins();





          set({

            status:"saved"

          });



        }

        catch(error){


          console.error(
            "Create failed:",
            error
          );


          set({

            status:"error"

          });


        }


      },
      updateSubAdmin: async(id,data)=>{


        try{


          set({

            status:"saving"

          });




          const response =
            await SubAdminService.update(
              id,
              data
            );




          console.log(
            "UPDATE RESPONSE:",
            response
          );

          set((state)=>({

            subAdmins:

              state.subAdmins.map((admin)=>{


                if(admin.id !== id)

                  return admin;




                return {


                  ...admin,

                  ...data,



                  status:

                    data.status
                      ?.toLowerCase() ||

                    admin.status,



                  permissions:

                    data.permissions ||

                    admin.permissions,


                };


              })


          }));

          await get().fetchSubAdmins();






          set({

            status:"saved"

          });



        }

        catch(error){


          console.error(
            "Update failed:",
            error
          );


          set({

            status:"error"

          });



        }


      },

      deleteSubAdmin: async(id)=>{


        try{


          set({

            status:"saving"

          });




          await SubAdminService.remove(id);




          await get().fetchSubAdmins();




          set({

            status:"saved"

          });



        }

        catch(error){


          console.error(
            "Delete failed:",
            error
          );


          set({

            status:"error"

          });


        }


      },

      fetchAuditLog: async()=>{


        try{


          const res =
            await SubAdminService.getAuditLogs();



          let logs=res;



          if(res?.data)

            logs=res.data;



          if(logs?.data)

            logs=logs.data;





          set({

            auditLog:

              Array.isArray(logs)
                ? logs
                : []

          });




        }

        catch(error){


          console.error(
            "Audit log failed:",
            error
          );


        }


      },

      getStats:()=>{


        const list =
          get().subAdmins || [];




        const total =
          list.length;




        const active =
          list.filter(

            (admin)=>

              admin.status?.toLowerCase()
              === "active"

          ).length;




        const inactive =
          list.filter(

            (admin)=>

              admin.status?.toLowerCase()
              === "inactive"

          ).length;




        return {

          total,

          active,

          inactive,

        };


      },


    }),



    {


      name:
        "fixitnow_subadmins",



      partialize:(state)=>({

        subAdmins:
          state.subAdmins,


        auditLog:
          state.auditLog,

      }),


    }


  )

);