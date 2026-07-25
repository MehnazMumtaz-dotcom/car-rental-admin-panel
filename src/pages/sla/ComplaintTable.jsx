import React, { useMemo, useState } from "react"
import { Eye, UserPlus, CheckCircle2 } from "lucide-react";
import { useSubAdminStore } from "../../store/SubAdminStore";
import {
  useSLAStore,
  getComplaintStatus,
  formatTimeLeft,
} from "../../store/SLAStore";

import ComplaintDetailModal from "./ComplaintDetailModal";
import AssignComplaintModal from "./AssignComplaintModal";
import { useAuthStore } from "../../store/authStore";

const PAGE_SIZE = 5;


function initials(name) {
  if (!name) return "--";

  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}



function PriorityPill({ priority }) {

  const isUrgent =
    priority?.toUpperCase() === "URGENT";


  return (
    <span
      className={`px-1.5 py-0.5 rounded-lg text-xs font-medium whitespace-nowrap ${
        isUrgent
          ? "bg-danger/10 text-danger"
          : "bg-primary/10 text-primary"
      }`}
    >
      {isUrgent ? "Urgent" : "Standard"}
    </span>
  );
}




function StatusPill({ status }) {

  const map = {

    "on-track": {
      label:"On Track",
      cls:"bg-success/10 text-success"
    },

    "at-risk":{
      label:"At Risk",
      cls:"bg-warning/10 text-warning"
    },

    breached:{
      label:"Breached",
      cls:"bg-danger/10 text-danger"
    },
     completed: {
    label: "Completed",
    cls: "bg-primary/10 text-primary"
  }

  };


  const s =
    map[status] || map["on-track"];


  return (
    <span
      className={`px-1.5 py-0.5 rounded-lg text-xs font-medium whitespace-nowrap ${s.cls}`}
    >
      {s.label}
    </span>
  );

}





function TimeLeftBar({
  msLeft,
  totalMs,
  status
}){


 const barColor = {

   "on-track":"bg-success",
   "at-risk":"bg-warning",
   breached:"bg-danger"

 }[status] || "bg-success";



 const elapsedPct =
 status === "breached"
 ?
 100
 :
 Math.min(
 100,
 Math.max(
 0,
 ((totalMs - msLeft) / totalMs) * 100
 )
 );



 return (

 <div>

 <p
 className={`text-xs font-medium mb-1 whitespace-nowrap ${
 status==="breached"
 ?
 "text-danger"
 :
 "text-textPrimary"
 }`}
 >

 {formatTimeLeft(msLeft)}

 </p>


 <div className="w-full h-1.5 rounded-full bg-borderColor overflow-hidden">

 <div

 className={`h-full ${barColor}`}

 style={{
 width:`${elapsedPct}%`
 }}

 />

 </div>


 </div>

 );

}







export default function ComplaintTable({
 filters,
 now
}){


const complaints = useSLAStore((s) => s.complaints || []);


const resolveComplaint =
useSLAStore((s)=>s.resolveComplaint);



const assignComplaint =
useSLAStore((s)=>s.assignComplaint);

const subAdmins = useSubAdminStore((s) => s.subAdmins);

const [page,setPage]=useState(1);


const [
viewingComplaint,
setViewingComplaint
]=useState(null);



const [
assigningComplaint,
setAssigningComplaint
]=useState(null);

const [viewMode, setViewMode] = useState("full");

const adminCity =
useAuthStore(
(s)=>s.user?.city
);

const enriched =
useMemo(()=>{

const complaintList = Array.isArray(complaints)
  ? complaints
  : complaints?.data || complaints?.complaints || [];


return complaintList



.filter(
(c)=>
!adminCity ||
c.city === adminCity ||
c.booking?.city === adminCity
)

.map((c) => {
  const sla = getComplaintStatus(
    {
      ...c,
      priority: c.priority?.toUpperCase(),
    },
    now
  );

  return {
    ...c,

    // 🔥 IMPORTANT
    slaStatus: sla.status,
    msLeft: sla.msLeft,
    totalMs: sla.totalMs,
  };
});



},[
complaints,
now,
adminCity
]);
const filtered = useMemo(() => {
  return enriched.filter((c) => {
    const id = String(c.id);


    const matchesSearch = filters.search
      ? id.toLowerCase().includes(filters.search.toLowerCase())
      : true;
    const matchesStatus = filters.status
      ? c.status === filters.status
      : true;


    const matchesPriority = filters.priority
      ? c.priority === filters.priority
      : true;

 
    const matchesCategory = filters.category
      ? c.category === filters.category
      : true;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesCategory
    );
  });
}, [enriched, filters]);

const sortedFiltered = useMemo(() => {
  return [...filtered].sort(
    (a,b)=> b.id - a.id
  );
}, [filtered]);



const totalPages =
Math.max(
1,
Math.ceil(
sortedFiltered.length / PAGE_SIZE
)
);



const currentPage =
Math.min(
page,
totalPages
);

const paginated =
sortedFiltered.slice(
(currentPage-1)*PAGE_SIZE,
currentPage*PAGE_SIZE
);

return (

<div className="bg-surface rounded-xl shadow-card border border-borderColor p-4 sm:p-5">


<div className="w-full">


<table className="w-full table-fixed text-sm">


<thead>

<tr className="border-b border-borderColor text-left text-textSecondary">

<th className="py-2 pr-1 font-medium">
Complaint ID
</th>


<th className="py-2 pr-1 font-medium hidden md:table-cell">
Category
</th>


<th className="py-2 pr-1 font-medium">
Priority
</th>


<th className="py-2 pr-1 font-medium hidden lg:table-cell">
SLA Type
</th>


<th className="py-2 pr-1 font-medium hidden sm:table-cell">
Time Left
</th>


<th className="py-2 pr-1 font-medium">
Status
</th>


<th className="py-2 pr-1 font-medium hidden lg:table-cell">
Assigned To
</th>


<th className="py-2 font-medium text-right">
Actions
</th>


</tr>

</thead>





<tbody>


{
paginated.map((c)=>{

const slaDays =
c.priority==="URGENT"
?
7
:
14;



const assignedName =
  c.assignedTo?.name || "--";




return (

<tr
onClick={() => {
  setViewMode("full");
  setViewingComplaint(c);
}}
key={c.id}

className="
border-b border-borderColor 
last:border-0 
cursor-pointer 
hover:bg-primary/5
transition
"
>

<td className="py-3 pr-1 font-medium text-primary truncate">
{c.id}
</td>



<td className="py-3 pr-1 text-textSecondary hidden md:table-cell truncate">
{c.category}
</td>




<td className="py-3 pr-1">

<PriorityPill
priority={c.priority}
/>

</td>




<td className="py-3 pr-1 text-textSecondary hidden lg:table-cell">

{slaDays} Days

</td>




<td className="py-3 pr-1 hidden sm:table-cell">

<TimeLeftBar
  msLeft={c.msLeft}
  totalMs={c.totalMs}
  status={c.slaStatus}
/>

</td>




<td className="py-3 pr-1">
  <div className="flex flex-col gap-1">

   
    <span className="text-[10px] font-semibold uppercase text-textSecondary">
      {c.status.replace("_", " ")}
    </span>

    <StatusPill status={c.slaStatus} />

  </div>
</td>




<td className="py-3 pr-1 hidden lg:table-cell">


{
assignedName !== "--"

?

<div className="flex items-center gap-2">

<span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[10px] font-semibold flex items-center justify-center">

{initials(assignedName)}

</span>


<span className="text-textPrimary text-xs">

{assignedName}

</span>

</div>

:

<span className="text-textSecondary text-xs">
--
</span>

}


</td>
<td className="py-3">
  <div className="flex items-center justify-end gap-2">

    <button
      className="text-textSecondary hover:text-primary"
      onClick={(e) => {
        e.stopPropagation();
        setViewMode("view");
        setViewingComplaint(c);
      }}
    >
      <Eye size={16} />
    </button>

    <button
      className="text-textSecondary hover:text-primary"
      onClick={(e) => {
        e.stopPropagation();
        setAssigningComplaint(c);
      }}
    >
      <UserPlus size={16} />
    </button>

    <button
      className="text-success"
      onClick={(e) => {
        e.stopPropagation();
        resolveComplaint(c.id);
      }}
    >
      <CheckCircle2 size={16} />
    </button>

  </div>
</td>


</tr>


);


})

}





{
paginated.length===0 &&

<tr>

<td
colSpan={8}
className="py-6 text-center text-textSecondary"
>

No complaints match these filters.

</td>

</tr>

}


</tbody>


</table>

<div className="flex items-center justify-between mt-4">

  <button
    onClick={() => setPage((p) => Math.max(1, p - 1))}
    disabled={currentPage === 1}
    className="px-3 py-1 text-sm border rounded disabled:opacity-50"
  >
    Prev
  </button>

  <div className="flex items-center gap-2">

    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
      <button
        key={p}
        onClick={() => setPage(p)}
        className={`px-3 py-1 text-sm rounded ${
          p === currentPage
            ? "bg-primary text-white"
            : "border"
        }`}
      >
        {p}
      </button>
    ))}

  </div>


  <button
    onClick={() =>
      setPage((p) => Math.min(totalPages, p + 1))
    }
    disabled={currentPage === totalPages}
    className="px-3 py-1 text-sm border rounded disabled:opacity-50"
  >
    Next
  </button>

</div>

</div>
{viewingComplaint && (
  <ComplaintDetailModal
    complaint={viewingComplaint}
    mode={viewMode}
    onClose={() => setViewingComplaint(null)}
    onAssign={(complaint) => {
      setAssigningComplaint(complaint);
    }}
    onResolve={async (id) => {
      await resolveComplaint(id);
      setViewingComplaint(null);
    }}
  />
)}


{assigningComplaint && (
  <AssignComplaintModal
    complaint={assigningComplaint}
    onClose={() => setAssigningComplaint(null)}
    onAssign={assignComplaint}
  />
)}



</div>


);


}
