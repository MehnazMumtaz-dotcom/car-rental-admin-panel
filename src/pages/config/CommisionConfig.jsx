import React, { useEffect } from "react";
import { Coins, Percent, Layers, Info } from "lucide-react";

import {
  useConfigStore,
  defaultCompanyConfig,
} from "../../store/ConfigStore";

import { useAuthStore } from "../../store/authStore";
import Switch from "../../components/ui/Switch";


export default function CommisionConfig() {


  const companyId = useAuthStore(
    (s) => s.user?.companyId
  );


  const config = useConfigStore(
    (s) => s.configs[companyId]
  ) || defaultCompanyConfig;



  const fetchCompanyConfig = useConfigStore(
    (s) => s.fetchCompanyConfig
  );


  const updateConfig = useConfigStore(
    (s) => s.updateConfig
  );



  // 🔥 Load company config
  useEffect(() => {

    if (companyId) {
      fetchCompanyConfig(companyId);
    }

  }, [companyId, fetchCompanyConfig]);




  const c =
    config?.commission ||
    {
      enabled: false,
      type: "flat",
      flatAmount: 0,
      percentage: 0,
      hybridFlat: 0,
      hybridPercentage: 0,
    };




  const patch = (data) => {

    if (!companyId) return;


    updateConfig(
      companyId,
      "commission",
      {
        ...c,
        ...data,
      }
    );

  };




  const options = [
    {
      key: "flat",
      icon: <Coins className="text-success" size={28} />,
      title: "Flat Commission",
      desc: "Fixed amount will be charged on each booking",
    },
    {
      key: "percentage",
      icon: <Percent className="text-primary" size={28} />,
      title: "Percentage Commission",
      desc: "Percentage will be charged on each booking",
    },
    {
      key: "hybrid",
      icon: <Layers className="text-secondary" size={28} />,
      title: "Hybrid (Flat + Percentage)",
      desc: "Both fixed amount and percentage will be charged",
    },
  ];



  return (

    <div className="bg-surface rounded-xl shadow-card border border-borderColor p-4 sm:p-5">


      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">


        <div>

          <h2 className="font-bold text-textPrimary text-base sm:text-lg">

            1.  Commission Settings — {config.companyName}

          </h2>


          <p className="text-sm text-textSecondary mt-0.5">

            Choose how platform commission will be calculated on each booking.

          </p>


        </div>



        <Switch

          checked={c.enabled}

          onCheckedChange={(val)=>
            patch({
              enabled: val
            })
          }

        />


      </div>





      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">


        {options.map((opt)=>(

          <div

            key={opt.key}

            onClick={() =>
              patch({
                type: opt.key
              })
            }


            className={`relative border rounded-xl p-4 cursor-pointer transition ${
              c.type === opt.key
              ? "border-success bg-success/5"
              : "border-borderColor"
            }`}

          >


            <span
              className={`absolute top-3 left-3 w-4 h-4 rounded-full border flex items-center justify-center ${
                c.type === opt.key
                ? "border-success"
                : "border-borderColor"
              }`}
            >

              {c.type === opt.key && (

                <span className="w-2 h-2 rounded-full bg-success"/>

              )}

            </span>




            <div className="flex flex-col items-center text-center mt-3">


              {opt.icon}



              <h3 className="font-bold text-textPrimary text-sm sm:text-base mt-2">

                {opt.title}

              </h3>



              <p className="text-xs text-textSecondary mt-1">

                {opt.desc}

              </p>





              {opt.key === "flat" && (

                <div
                  className="flex items-center border border-borderColor rounded-xl mt-3 w-full overflow-hidden"
                  onClick={(e)=>e.stopPropagation()}
                >

                  <span className="px-3 py-2 text-sm bg-background text-textSecondary">
                    PKR
                  </span>


                  <input

                    type="number"

                    value={c.flatAmount || ""}

                    onChange={(e)=>
                      patch({
                        flatAmount:Number(e.target.value)
                      })
                    }

                    className="flex-1 px-2 py-2 text-sm outline-none bg-transparent"

                  />


                </div>

              )}






              {opt.key === "percentage" && (

                <div
                  className="flex items-center border border-borderColor rounded-xl mt-3 w-full overflow-hidden"
                  onClick={(e)=>e.stopPropagation()}
                >


                  <input

                    type="number"

                    value={c.percentage || ""}

                    onChange={(e)=>
                      patch({
                        percentage:Number(e.target.value)
                      })
                    }

                    className="flex-1 px-3 py-2 text-sm outline-none bg-transparent"

                  />


                  <span className="px-3 py-2 text-sm bg-background">
                    %
                  </span>


                </div>

              )}







              {opt.key === "hybrid" && (

                <div
                  className="flex items-center gap-2 mt-3 w-full"
                  onClick={(e)=>e.stopPropagation()}
                >


                  <div className="flex items-center border rounded-xl overflow-hidden flex-1">


                    <span className="px-2 py-2 text-xs bg-background">
                      PKR
                    </span>


                    <input

                      type="number"

                      value={c.hybridFlat || ""}

                      onChange={(e)=>
                        patch({
                          hybridFlat:Number(e.target.value)
                        })
                      }


                      className="w-full px-2 py-2 text-sm outline-none"

                    />


                  </div>




                  <span>+</span>




                  <div className="flex items-center border rounded-xl overflow-hidden flex-1">


                    <input

                      type="number"

                      value={c.hybridPercentage || ""}

                      onChange={(e)=>
                        patch({
                          hybridPercentage:Number(e.target.value)
                        })
                      }


                      className="w-full px-2 py-2 text-sm outline-none"

                    />


                    <span className="px-2 py-2 text-xs bg-background">
                      %
                    </span>


                  </div>


                </div>

              )}



            </div>


          </div>

        ))}


      </div>




      <div className="flex items-center gap-2 text-sm text-success mt-4">

        <Info size={16}/>

        This commission setting will be applied immediately to all new bookings.

      </div>


    </div>

  );

}