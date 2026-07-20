import { create } from "zustand";
import { useAuthStore } from "./authStore";

const API = "http://localhost:3000/customers";

export const useCustomerStore = create((set) => ({

  customers: [],
  selectedCustomer: null,
  isDrawerOpen: false,
  loading: false,

  filters: {
    search: "",
    status: "",
    city: "",
    type: "",
  },

  setFilters: (f) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...f,
      },
    })),


  openCustomer: (customer) =>
    set({
      selectedCustomer: customer,
      isDrawerOpen: true,
    }),


  closeCustomer: () =>
    set({
      selectedCustomer: null,
      isDrawerOpen: false,
    }),


  setCustomers: (data) =>
    set({
      customers: data,
    }),


  setLoading: (val) =>
    set({
      loading: val,
    }),

  fetchCustomers: async () => {

    try {

      set({ loading:true });


      const { token, user } = useAuthStore.getState();


      const companyId =
        user?.companyId ||
        user?.company_id;


      if (!token || !companyId) {

        console.log(
          "⛔ Auth not ready",
          {
            token,
            companyId
          }
        );

        set({loading:false});
        return;
      }



      const res = await fetch(
        `${API}/company/${companyId}`,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );


      if(!res.ok){
        throw new Error("Failed fetching customers");
      }


      const data = await res.json();


      console.log(
        "CUSTOMERS RESPONSE:",
        data
      );


      set({
        customers:
          data.customers ||
          data.data ||
          data ||
          [],

        loading:false
      });



    } catch(err){

      console.error(
        "Fetch Customers Error:",
        err
      );

      set({
        loading:false
      });

    }

  },

  addCustomer: async(customer)=>{

    try{

      const {token,user}=useAuthStore.getState();


      if(!token || !user){
        console.log("Auth missing");
        return;
      }


      const res = await fetch(
        API,
        {
          method:"POST",

          headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${token}`
          },

          body:JSON.stringify(customer)

        }
      );


      const data = await res.json();


      set(state=>({
        customers:[
          data,
          ...state.customers
        ]
      }));


    }catch(err){

      console.error(
        "Add Customer Error",
        err
      );

    }

  },

  updateCustomerStatus: async(id,status)=>{

    try{

      const {token}=useAuthStore.getState();


      if(!token){
        return;
      }


      const res = await fetch(
        `${API}/${id}`,
        {
          method:"PATCH",

          headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${token}`
          },

          body:JSON.stringify({
            status
          })

        }
      );


      const updated =
        await res.json();



      set(state=>({

        customers:
          state.customers.map(c=>
            c.id===id
            ? updated
            : c
          ),


        selectedCustomer:
          state.selectedCustomer?.id===id
          ? updated
          : state.selectedCustomer

      }));



    }catch(err){

      console.error(
        "Update Status Error",
        err
      );

    }

  },

  deleteCustomer: async(id)=>{

    try{


      const {token}=useAuthStore.getState();


      if(!token){
        return;
      }


      const res = await fetch(
        `${API}/${id}`,
        {
          method:"DELETE",

          headers:{
            Authorization:`Bearer ${token}`
          }

        }
      );


      if(!res.ok){
        throw new Error(
          "Delete failed"
        );
      }


      set(state=>({

        customers:
          state.customers.filter(
            c=>c.id!==id
          ),


        selectedCustomer:
          state.selectedCustomer?.id===id
          ? null
          : state.selectedCustomer

      }));


    }catch(err){

      console.error(
        "Delete Error",
        err
      );

    }

  },


}));