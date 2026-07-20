import { create } from "zustand";

import {
  getConfig,
  createConfig,
  updateConfig as updateConfigAPI,
} from "../services/configService";


export const defaultCompanyConfig = {
  commission: {
    enabled: false,
    type: "flat",
    flatAmount: 0,
    percentage: 0,
    hybridFlat: 0,
    hybridPercentage: 0,
  },

  minBooking: {
    enabled: false,
    amount: 0,
  },

  urgentSurcharge: {
    enabled: false,
    amount: 0,
  },

  active: true,
};

export const useConfigStore = create((set, get) => ({

  configs: {},

  loading: false,
  error: null,
  status: "idle",
  lastSaved: null,

  fetchCompanyConfig: async (companyId) => {

    if (!companyId) return;


    set({
      loading: true,
      error: null,
    });


    try {

      const res = await getConfig(companyId);

      const data = res?.data ?? res;
   const formattedConfig = {
  ...defaultCompanyConfig,
companyName:
  data.company?.name || `Company ${companyId}`,
  active: data.active ?? true,

  commission: {
    enabled: true,

    type:
      data.commissionType
        ? data.commissionType.toLowerCase()
        : "flat",

    flatAmount:
      data.flatAmount ?? 0,

    percentage:
      data.percentage ?? 0,

    hybridFlat:
      data.hybridFlat ?? 0,

    hybridPercentage:
      data.hybridPercentage ?? 0,
  },


  minBooking: {
    enabled:
      data.minBookingEnabled ?? false,

    amount:
      data.minBookingAmount ?? 0,
  },


  urgentSurcharge: {
    enabled:
      data.urgentSurchargeEnabled ?? false,

    amount:
      data.urgentSurchargeAmount ?? 0,
  },
};   
  
      set((state) => ({
        configs: {
          ...state.configs,
        [companyId]: formattedConfig,
        },

        loading: false,
        status: "idle",
      }));


    } catch(error) {

      console.error(
        "Fetch Config Error:",
        error
      );


      set((state)=>({

        configs:{
          ...state.configs,
          [companyId]: defaultCompanyConfig,
        },

        loading:false,

        error:
          error.response?.data?.message ||
          "Failed to fetch config",

      }));

    }

  },

  updateConfig: async (
    companyId,
    key,
    value
  ) => {


    if(!companyId) return;


    const current =
      get().configs[companyId] ||
      defaultCompanyConfig;



    const updatedConfig = {

      ...current,

      [key]: value,

    };

    set((state)=>({

      configs:{
        ...state.configs,

        [companyId]: updatedConfig,
      },

      status:"saving",

    }));



    try {


      await updateConfigAPI(
        companyId,
        updatedConfig
      );



      set({

        status:"idle",

        lastSaved: Date.now(),

      });



    } catch(error) {


      console.error(
        "Update Config Error:",
        error
      );


      try {
        await createConfig({

          companyId,

          ...updatedConfig,

        });



        set({

          status:"idle",

          lastSaved: Date.now(),

        });



      } catch(createError) {


        console.error(
          "Create Config Error:",
          createError
        );


        set({

          status:"error",

          error:
            createError.response?.data?.message ||
            "Save failed",

        });

      }

    }

  },
toggleCompanyActive: async (companyId, value) => {

  if (!companyId) return;


  const current =
    get().configs[companyId] ||
    defaultCompanyConfig;


  const updatedConfig = {
    ...current,
    active: value,
  };


  set((state) => ({
    configs: {
      ...state.configs,
      [companyId]: updatedConfig,
    },
    status: "saving",
  }));


  try {

    await updateConfigAPI(
      companyId,
      updatedConfig
    );


    set({
      status: "idle",
      lastSaved: Date.now(),
    });


  } catch(error) {

    console.error(
      "Toggle Company Error:",
      error
    );


    set({
      status:"error",
      error:
        error.response?.data?.message ||
        "Save failed",
    });

  }

},

}));