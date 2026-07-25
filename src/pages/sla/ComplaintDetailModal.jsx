import React from "react";
import { X, CheckCircle2, UserPlus } from "lucide-react";
import { formatTimeLeft } from "../../store/SLAStore";
import Button from "../../components/ui/Button";


const STATUS_STYLE = {

  OPEN: "bg-warning/10 text-warning",

  IN_PROGRESS: "bg-primary/10 text-primary",

  RESOLVED: "bg-success/10 text-success",

  ESCALATED: "bg-danger/10 text-danger",

};



export default function ComplaintDetailModal({
  complaint,
  mode = "full",
  onClose,
  onAssign,
  onResolve,
}) {


  if (!complaint) return null;



  const status =
    complaint.status?.toUpperCase();



  const slaDays =
    complaint.priority?.toUpperCase() === "URGENT"
      ? 7
      : 14;


  const isFullMode = mode === "full";



  return (


<div className="fixed inset-0 z-50">

<div
className="absolute inset-0 bg-secondary/40"
onClick={onClose}
/>

<div
className="
absolute right-0 top-0
h-full w-full sm:w-[430px]
bg-surface
shadow-xl
border-l border-borderColor
overflow-y-auto
"
>

<div className="
flex items-center justify-between
px-5 py-4
border-b border-borderColor
">


<div>

<h2 className="font-semibold text-lg">
Complaint #{complaint.id}
</h2>


<span
className={`
inline-block mt-2
px-2 py-1 rounded-lg text-xs font-medium
${STATUS_STYLE[status] || ""}
`}
>

{status?.replace("_"," ")}

</span>


</div>



<button
onClick={onClose}
>

<X size={20}/>

</button>


</div>





<div className="p-5 space-y-6">
<section>


<h3 className="font-semibold mb-3">
Complaint Details
</h3>


<div className="space-y-2 text-sm">


<Row
label="Category"
value={complaint.category}
/>


<Row
label="Priority"
value={complaint.priority}
/>


<Row
label="Description"
value={
complaint.description ||
"---"
}
/>


<Row
label="Created At"
value={
complaint.createdAt
?
new Date(
complaint.createdAt
).toLocaleString()
:
"---"
}
/>



</div>


</section>
<section>


<h3 className="font-semibold mb-3">
SLA Information
</h3>


<div className="space-y-2 text-sm">


<Row
label="SLA Window"
value={`${slaDays} Days`}
/>


<Row
label="Deadline"
value={
complaint.slaDeadline
?
new Date(
complaint.slaDeadline
).toLocaleString()
:
"---"
}
/>


<Row
label="Time Left"
value={
complaint.msLeft
?
formatTimeLeft(
complaint.msLeft
)
:
"---"
}
/>



</div>


</section>

<section>


<h3 className="font-semibold mb-3">
Customer Information
</h3>


<div className="space-y-2 text-sm">


<Row
label="Name"
value={
complaint.booking?.customerName ||
"---"
}
/>


<Row
label="Phone"
value={
complaint.booking?.phone ||
"---"
}
/>


<Row
label="CNIC"
value={
complaint.booking?.cnic ||
"---"
}
/>


</div>


</section>


<section>


<h3 className="font-semibold mb-3">
Booking Information
</h3>


<div className="space-y-2 text-sm">


<Row
label="Booking ID"
value={
complaint.booking?.id ||
"---"
}
/>


<Row
label="Vehicle"
value={
complaint.booking?.vehicle?.name ||
complaint.booking?.vehicleName ||
"---"
}
/>


<Row
label="City"
value={
complaint.booking?.city ||
"---"
}
/>


<Row
label="Start Date"
value={
complaint.booking?.startDate
?
new Date(
complaint.booking.startDate
).toLocaleDateString()
:
"---"
}
/>


<Row
label="End Date"
value={
complaint.booking?.endDate
?
new Date(
complaint.booking.endDate
).toLocaleDateString()
:
"---"
}
/>



</div>


</section>

<section>


<h3 className="font-semibold mb-3">
Assignment
</h3>


<Row

label="Assigned To"

value={
complaint.assignedTo?.name ||
"Unassigned"
}

/>


</section>

</div>


{
isFullMode &&

<div
className="
sticky bottom-0
bg-surface
border-t border-borderColor
px-5 py-4
flex gap-3
"
>



<Button

variant="primary"

onClick={(e) => {
  e.stopPropagation();

  if (onAssign) {
    onAssign(complaint);
  }
}}

>

<UserPlus size={16}/>
Assign

</Button>





{
status !== "RESOLVED" &&

<Button
variant="success"
onClick={async (e) => {
  e.stopPropagation();

  if (onResolve) {
    await onResolve(complaint.id);
  }

  onClose(); 
}}
>
<CheckCircle2 size={16}/>
Resolve
</Button>

}



<Button

variant="outline"

onClick={onClose}

>

Close

</Button>



</div>

}




</div>


</div>


);

}




function Row({
label,
value
}){


return (

<div className="flex justify-between gap-4">

<span className="text-textSecondary">
{label}
</span>


<span className="font-medium text-right">
{value}
</span>


</div>

);


}