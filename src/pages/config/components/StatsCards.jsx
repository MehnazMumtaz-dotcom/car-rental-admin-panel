import { Percent, MapPin, DollarSign } from "lucide-react";

export default function StatCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

      {/* Card 1 */}
      <div className="bg-white rounded-xl shadow-sm border p-5 flex items-center gap-4">
        <div className="p-3 rounded-full bg-green-100 text-green-600">
          <Percent size={22} />
        </div>

        <div>
          <p className="text-sm text-gray-500">Commission Type</p>
          <h2 className="text-lg font-semibold text-gray-800">
            Hybrid Active
          </h2>
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-white rounded-xl shadow-sm border p-5 flex items-center gap-4">
        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
          <MapPin size={22} />
        </div>

        <div>
          <p className="text-sm text-gray-500">Active Cities</p>
          <h2 className="text-lg font-semibold text-gray-800">
            3 Cities
          </h2>
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-white rounded-xl shadow-sm border p-5 flex items-center gap-4">
        <div className="p-3 rounded-full bg-purple-100 text-purple-600">
          <DollarSign size={22} />
        </div>

        <div>
          <p className="text-sm text-gray-500">Min Booking Fee</p>
          <h2 className="text-lg font-semibold text-gray-800">
            PKR 1000
          </h2>
        </div>
      </div>

    </div>
  );
}