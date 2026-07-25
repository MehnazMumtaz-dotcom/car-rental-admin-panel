import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  getComplaints,
  assignComplaint as assignComplaintApi,
  resolveComplaint as resolveComplaintApi,
} from "../services/complaintService";


export const CATEGORIES = [
  "BILLING",
  "VEHICLE ISSUE",
  "DRIVER BEHAVIOR",
  "BOOKING ERROR",
  "OTHER",
];


export const PRIORITIES = [
  { key: "STANDARD", label: "Standard", slaDays: 14 },
  { key: "URGENT", label: "Urgent", slaDays: 7 },
];


export const AGENTS = [];


const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;


export function getComplaintStatus(complaint, nowTs) {

  const priorityMeta = PRIORITIES.find(
    (p) => p.key === complaint.priority
  );


  const totalMs =
    (priorityMeta?.slaDays || 7) * DAY;


  const deadline = new Date(
    complaint.slaDeadline
  ).getTime();


  const msLeft = deadline - nowTs;


  let status = "on-track";

if (complaint.status === "RESOLVED") {
  return {
    msLeft: 0,
    status: "completed",
    totalMs
  };
}
  if (msLeft <= 0)
    status = "breached";

  else if(msLeft < totalMs * 0.25)
    status = "at-risk";


  return {
    msLeft,
    status,
    totalMs
  };

}

export function getSLAState(c) {


  if (c.status === "RESOLVED") return "completed";

  if (c.status === "ESCALATED") {
  const nowTs = Date.now();
  const { status } = getComplaintStatus(c, nowTs);
  return status === "breached" ? "breached" : "at-risk";
}

  const nowTs = Date.now();

  const { status } = getComplaintStatus(c, nowTs);

  return status; 
}

export function formatTimeLeft(msLeft) {

  const abs = Math.abs(msLeft);


  const d = Math.floor(abs / DAY);

  const h = Math.floor(
    (abs % DAY) / HOUR
  );

  const m = Math.floor(
    (abs % HOUR) / (60 * 1000)
  );


  const sign =
    msLeft < 0 ? "-" : "";


  if(d > 0){

    return `${sign}${d}d ${String(h).padStart(2,"0")}h ${String(m).padStart(2,"0")}m`;

  }


  return `${sign}${String(h).padStart(2,"0")}h ${String(m).padStart(2,"0")}m`;

}



export const useSLAStore = create(

persist(

(set,get)=>(

{

complaints: [],

status:"saved",

loading:false,

error:null,


fetchComplaints: async()=>{

try{

set({
loading:true,
error:null
});


const data = await getComplaints();


set({

  complaints: Array.isArray(data)
    ? data
    : data.data || data.complaints || [],

  loading:false

});


}

catch(error){

console.log(error);


set({

loading:false,

error:error.message

});


}

},



getComplaintsByCity:(city)=>{

if(!city)
return get().complaints;


return get()
.complaints
.filter(
(c)=>c.booking?.city === city
);

},


resolveComplaint: async(id)=>{


try{


set({
status:"saving"
});


await resolveComplaintApi(id);


await get().fetchComplaints();


set({
status:"saved"
});


}

catch(err){

console.error(
"Resolve failed",
err
);


set({
status:"error"
});


}


},

assignComplaint: async (id, adminId) => {
  try {
    set({ status: "saving" });

    const updatedComplaint = await assignComplaintApi(id, adminId);

    set((state) => ({
      complaints: state.complaints.map((c) =>
        c.id === id ? updatedComplaint : c
      ),
      status: "saved",
    }));

  } catch (err) {
    console.error("Assign failed", err);
    set({ status: "error" });
  }
},


refresh: async()=>{

await get().fetchComplaints();

}



}

),


{

name:"fixitnow_sla_complaints",

partialize:(state)=>({

complaints:state.complaints

})

}


)

);