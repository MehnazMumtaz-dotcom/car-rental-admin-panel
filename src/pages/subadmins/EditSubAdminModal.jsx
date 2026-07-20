import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

import { PERMISSIONS } from "../../store/SubAdminStore";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";


export default function EditSubAdminModal({
  admin,
  onClose,
  onSave,
}) {


  const [draft, setDraft] = useState({
    name: "",
    email: "",
    status: "active",
    permissions: [],
  });



  useEffect(() => {

  if (admin) {

    setDraft({

      name: admin.name || "",

      email: admin.email || "",

      status:
        admin.status?.toLowerCase() || "active",


      permissions:

        Array.isArray(admin.permissions)

          ? admin.permissions.map((perm) =>
              typeof perm === "string"
                ? perm
                : perm.key
            )

          : [],

    });

  }

}, [admin]);




  if (!admin) return null;





  const update = (field) => (eOrValue) => {

    const value =
      eOrValue?.target
        ? eOrValue.target.value
        : eOrValue;



    setDraft((prev) => ({

      ...prev,

      [field]: value,

    }));

  };






 const togglePermission = (permission) => {

  const key =
    typeof permission === "string"
      ? permission
      : permission.key;



  setDraft((prev) => {

    const current =
      Array.isArray(prev.permissions)
        ? prev.permissions
        : [];



    return {

      ...prev,

      permissions:

        current.includes(key)

          ? current.filter(
              (item) => item !== key
            )

          : [
              ...current,
              key
            ],

    };

  });

};


const handleSave = async () => {


  const payload = {

    name: draft.name.trim(),

    email: draft.email.trim(),

    status: draft.status,

    permissions: draft.permissions,

  };



  console.log(
    "EDIT SUB ADMIN PAYLOAD:",
    payload
  );



  if (onSave) {

    await onSave(
      admin.id,
      payload
    );

  }



};

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/50">


      <div className="bg-surface rounded-xl shadow-card border border-borderColor w-full max-w-lg max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between px-5 py-4 border-b border-borderColor">


          <h2 className="font-semibold text-textPrimary">

            Edit Sub-Admin

          </h2>



          <button

            onClick={onClose}

            className="text-textSecondary hover:text-textPrimary"

          >

            <X size={18}/>

          </button>


        </div>

        <div className="p-5 space-y-4">



          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">


            <Input

              label="Full Name"

              value={draft.name}

              onChange={update("name")}

            />



            <Input

              label="Email Address"

              type="email"

              value={draft.email}

              onChange={update("email")}

            />


          </div>
          <div className="sm:w-1/2">


            <label className="text-sm text-textSecondary">

              Status

            </label>



            <Select

              value={draft.status}

              onChange={update("status")}

              options={[

                {
                  label:"Active",
                  value:"active"
                },

                {
                  label:"Inactive",
                  value:"inactive"
                },

              ]}

            />


          </div>


          <div>


            <p className="text-sm font-medium text-textPrimary mb-2">

              Permissions

            </p>





            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">


              {PERMISSIONS?.length > 0 ? (

                PERMISSIONS.map((perm)=>{


                  const key =
                    typeof perm === "string"
                      ? perm
                      : perm.key;



                  const label =
                    typeof perm === "string"
                      ? perm
                      : perm.label;



                  const desc =
                    typeof perm === "string"
                      ? ""
                      : perm.desc;





                  const checked =
                    draft.permissions.includes(key);




                  return (

                    <label

                      key={key}

                      className={`flex items-start gap-2 border rounded-xl p-2.5 cursor-pointer transition ${
                        
                        checked
                          ? "border-primary bg-primary/5"
                          : "border-borderColor"

                      }`}

                    >


                      <input

                        type="checkbox"

                        checked={checked}

                        onChange={() =>
                          togglePermission(perm)
                        }

                        className="mt-0.5 h-4 w-4 rounded border-borderColor text-primary"

                      />



                      <span>


                        <span className="block text-sm font-medium text-textPrimary">

                          {label}

                        </span>



                        <span className="block text-xs text-textSecondary">

                          {desc}

                        </span>


                      </span>


                    </label>

                  );


                })


              ) : (


                <p className="text-sm text-textSecondary">

                  No permissions available

                </p>


              )}



            </div>



          </div>


        </div>


        <div className="flex flex-col sm:flex-row gap-3 px-5 py-4 border-t border-borderColor">


          <Button

            variant="primary"

            onClick={handleSave}

          >

            Save Changes

          </Button>





          <Button

            variant="outline"

            onClick={onClose}

          >

            Cancel

          </Button>


        </div>


      </div>


    </div>


  );

}