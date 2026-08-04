import React, { useEffect, useMemo, useState } from "react";
import { Edit2, Trash2 } from "lucide-react";

import { useSubAdminStore } from "../../store/SubAdminStore";
import { useAuthStore } from "../../store/authStore";

import SearchInput from "../../components/ui/SearchInput";
import Select from "../../components/ui/Select";
import StatusBadge from "../../components/ui/StatusBadge";
import EditSubAdminModal from "./EditSubAdminModal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";


const PAGE_SIZE = 4;



function initials(name = "") {

  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

}



export default function SubAdminList() {


  const {
    subAdmins: allSubAdmins,
    fetchSubAdmins,
    deleteSubAdmin,
    updateSubAdmin,
    loading,
  } = useSubAdminStore();



  const adminCity = useAuthStore(
    (state) => state.user?.city
  );



  useEffect(() => {

    fetchSubAdmins();

  }, [fetchSubAdmins]);






  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("");

  const [page, setPage] = useState(1);

  const [editingAdmin, setEditingAdmin] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);

  const [selectedId, setSelectedId] = useState(null);






  const subAdmins = useMemo(() => {


    return (allSubAdmins || []).filter(

      (admin) =>

        !adminCity ||

        admin.city === adminCity

    );


  }, [allSubAdmins, adminCity]);








  const filtered = useMemo(() => {


    return subAdmins.filter((admin)=>{


      const matchesSearch =

        admin.name
          ?.toLowerCase()
          .includes(search.toLowerCase())

        ||

        admin.email
          ?.toLowerCase()
          .includes(search.toLowerCase());




      const matchesStatus =

        statusFilter

          ? admin.status?.toLowerCase() ===
            statusFilter.toLowerCase()

          : true;




      return matchesSearch && matchesStatus;


    });


  },[
    subAdmins,
    search,
    statusFilter
  ]);







  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );



  const currentPage = Math.min(
    page,
    totalPages
  );



  const paginated = filtered.slice(

    (currentPage - 1) * PAGE_SIZE,

    currentPage * PAGE_SIZE

  );








  const toggleStatus = async(admin)=>{


    if(!admin?.id)
      return;



    const newStatus =

      admin.status?.toLowerCase() === "active"

        ? "inactive"

        : "active";




    if(
      !window.confirm(
        `Change status to ${newStatus}?`
      )
    )

      return;




    await updateSubAdmin(

      admin.id,

      {
        status:newStatus
      }

    );



    await fetchSubAdmins();


  };









  const handleSaveEdit = async(
    id,
    data
  )=>{


    if(!id || !data)
      return;



    await updateSubAdmin(
      id,
      data
    );



    await fetchSubAdmins();


    setEditingAdmin(null);


  };







  const handleDeleteClick=(id)=>{

    setSelectedId(id);

    setOpenDialog(true);

  };








  const handleConfirmDelete=async()=>{


    if(selectedId){

      await deleteSubAdmin(
        selectedId
      );

    }



    setSelectedId(null);

    setOpenDialog(false);


  };







  const handleCancel=()=>{

    setSelectedId(null);

    setOpenDialog(false);

  };




  if(loading){

    return (

      <div className="p-5 text-center text-textSecondary">

        Loading sub-admins...

      </div>

    );

  }









  return (

    <div className="bg-surface rounded-xl shadow-card border border-borderColor p-4 sm:p-5">




      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">


        <div>

          <h2 className="font-semibold text-red-600">

            Sub-Admin List

          </h2>


          <p className="text-sm text-textSecondary">

            All sub-admin accounts in your organization

          </p>


        </div>





        <div className="flex flex-col sm:flex-row gap-2">


          <SearchInput

            placeholder="Search sub-admin..."

            value={search}

            onChange={(value)=>{

              setSearch(value);

              setPage(1);

            }}

          />




          <Select

            value={statusFilter}

            onChange={(value)=>{

              setStatusFilter(value);

              setPage(1);

            }}

            placeholder="All Status"

            options={[

              {
                label:"All Status",
                value:""
              },

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

      </div>




      {/* DESKTOP TABLE — sirf md aur usse bari screens per dikhega */}
      <div className="hidden md:block overflow-x-auto">

        <table className="w-full text-sm">


          <thead>

            <tr className="border-b border-borderColor text-left">

              <th className="py-2">#</th>

              <th className="py-2">Name</th>

              <th className="py-2">Email</th>

              <th className="py-2">Status</th>

              <th className="py-2">Actions</th>

            </tr>

          </thead>




          <tbody>

          {paginated.map((admin,index)=>(


            <tr

              key={admin.id || index}

              className="border-b border-borderColor"

            >


              <td className="py-3">

                {
                  (currentPage-1)*PAGE_SIZE
                  +
                  index
                  +
                  1
                }

              </td>




              <td className="py-3">


                <div className="flex items-center gap-2">


                  <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs shrink-0">

                    {initials(admin.name)}

                  </span>


                  <span className="truncate">{admin.name || "N/A"}</span>


                </div>

              </td>




              <td className="py-3 text-textSecondary truncate">

                {admin.email || "-"}

              </td>




              <td className="py-3">


                <button
                  onClick={()=>toggleStatus(admin)}
                >

                  <StatusBadge
                    status={admin.status}
                  />

                </button>


              </td>




              <td className="py-3">


                <div className="flex gap-3">


                 <button
                   onClick={() => {
                     setEditingAdmin(admin);
                   }}
                 >

                    <Edit2 size={16}/>

                  </button>




                  <button

                    onClick={()=>
                      handleDeleteClick(admin.id)
                    }

                    className="text-danger"

                  >

                    <Trash2 size={16}/>

                  </button>


                </div>

              </td>


            </tr>

          ))}




          {paginated.length===0 && (

            <tr>

              <td

                colSpan="5"

                className="text-center py-4 text-textSecondary"

              >

                No sub-admins found

              </td>

            </tr>

          )}


          </tbody>

        </table>

      </div>




      {/* MOBILE CARD LIST — sirf md se choti screens per dikhega */}
      <div className="md:hidden space-y-3">

        {paginated.map((admin, index) => (

          <div
            key={admin.id || index}
            className="border border-borderColor rounded-xl p-3"
          >

            <div className="flex items-start justify-between gap-2 mb-2">

              <div className="flex items-center gap-2 min-w-0">

                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs shrink-0">
                  {initials(admin.name)}
                </span>

                <div className="min-w-0">
                  <p className="font-semibold text-textPrimary truncate">
                    {admin.name || "N/A"}
                  </p>
                  <p className="text-xs text-textSecondary truncate">
                    {admin.email || "-"}
                  </p>
                </div>

              </div>

              <span className="text-xs text-textSecondary shrink-0">
                #{(currentPage - 1) * PAGE_SIZE + index + 1}
              </span>

            </div>

            <div className="flex items-center justify-between mt-3">

              <button onClick={() => toggleStatus(admin)}>
                <StatusBadge status={admin.status} />
              </button>

              <div className="flex gap-4">

                <button onClick={() => setEditingAdmin(admin)}>
                  <Edit2 size={18} />
                </button>

                <button
                  onClick={() => handleDeleteClick(admin.id)}
                  className="text-danger"
                >
                  <Trash2 size={18} />
                </button>

              </div>

            </div>

          </div>

        ))}

        {paginated.length === 0 && (
          <p className="text-center py-4 text-textSecondary text-sm">
            No sub-admins found
          </p>
        )}

      </div>




      {/* PAGINATION */}

      <div className="flex justify-between items-center mt-4 text-sm">


        <span className="text-textSecondary">

          Page {currentPage} of {totalPages}

        </span>




        <div className="flex gap-2">


          <button

            onClick={()=>
              setPage(
                (p)=>Math.max(p-1,1)
              )
            }

            disabled={currentPage===1}

            className="px-3 py-1 border rounded disabled:opacity-50"

          >

            Prev

          </button>





          <button

            onClick={()=>
              setPage(
                (p)=>
                  Math.min(
                    p+1,
                    totalPages
                  )
              )
            }

            disabled={currentPage===totalPages}

            className="px-3 py-1 border rounded disabled:opacity-50"

          >

            Next

          </button>


        </div>

      </div>








      <EditSubAdminModal

        admin={editingAdmin}

        onClose={()=>
          setEditingAdmin(null)
        }

        onSave={handleSaveEdit}

      />






      <ConfirmDialog

        open={openDialog}

        title="Delete Sub-Admin"

        message="Are you sure you want to delete this sub-admin?"

        confirmText="Delete"

        cancelText="Cancel"

        onConfirm={handleConfirmDelete}

        onCancel={handleCancel}

      />



    </div>

  );

}