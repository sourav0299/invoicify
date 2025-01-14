

export default function Reports() {
  return (
    <div className="flex flex-col gap-3 pt-3 px-6 bg-universal_gray_background">
      <div className="flex flex-col items-start">
        <div className="flex justify-between w-full gap-3">
          <div>
            <div className="text-2xl font-semibold text-business_settings_black_text">
              Reports
            </div>
            <div className="text-business_settings_gray_text">
              An Overview of all your transactions over the year.
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="text-gray-700">
          Filter by:
        </div>
      </div>

      <div className="flex gap-1">
  <div className="h-[56px] border rounded-md border-gray-300 bg-white p-3 w-full">
    <div className="text-sm font-semibold text-gray-700 text-center ">Party</div>
  </div>
  <div className="h-[56px] border rounded-md border-gray-300 bg-white p-3 w-full">
    <div className="text-sm font-semibold text-gray-700 text-center">Payment Collection</div>
  </div>
  <div className="h-[56px] border rounded-md border-gray-300 bg-white p-3 w-full">
    <div className="text-sm font-semibold text-gray-700 text-center">Item</div>
  </div>
  <div className="h-[56px] border rounded-md border-gray-300 bg-white p-3 w-full">
    <div className="text-sm font-semibold text-gray-700 text-center">Category</div>
  </div>
  <div className="h-[56px] border rounded-md border-gray-300 bg-white p-3 w-full">
    <div className="text-sm font-semibold text-gray-700 text-center">Summary</div>
  </div>
</div>
</div>
  );
}
