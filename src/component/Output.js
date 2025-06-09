import Loader from "./Loader";

export default function Output({
  queryError,
  data,
  data1,
  handleNext,
  handlePrev,
  page,
  headers,
  isFetching,
}) {

  
  if (isFetching) {
    return (
      <div className="px-4 mt-28 w-[50%] max-h-[100vh] overflow-scroll">
        <div className="m-28">
          <Loader />
        </div>
      </div>
    );
  }

  if (queryError !== "") {
    return (
      <div className="px-4 mt-28 w-[50%] max-h-[100vh] overflow-scroll">
        <div className="text-red-600">{queryError}</div>
      </div>
    );
  }

  if (data && data.length > 0 && Object.keys(data[0]).length !== 0) {
    return (
      <div className="px-4 mt-28 w-[50%] max-h-[100vh] overflow-scroll">
        {headers && (
          <div className="relative flex flex-col w-full overflow-auto text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
            <div
              className="grid text-left table-auto min-w-max text-xs"
              style={{
                gridTemplateColumns: `repeat(${headers.length}, minmax(max-content, 300px))`,
                maxHeight: "75vh",
              }}
            >
              {/* Header Row */}
              {headers.map((header, index) => (
                <div
                  key={`header-${index}`}
                  className="min-h-10 p-2 flex items-center justify-center border-b border-blue-gray-100 bg-gray-100 font-sans font-medium text-blue-gray-900"
                >
                  {header}
                </div>
              ))}

              {/* Data Rows */}
              {Array.isArray(data1) &&
                data1.length > 0 &&
                data1.map((row, rowIndex) =>
                  headers.map((key, colIndex) => {
                    const value = row?.[key];
                    return (
                      <div
                        key={`cell-${rowIndex}-${colIndex}`}
                        className="min-h-10 p-2 border-b border-blue-gray-50 font-sans font-normal text-blue-gray-900 flex items-center justify-center"
                      >
                        {typeof value === "object" && value !== null
                          ? JSON.stringify(value)
                          : value}
                      </div>
                    );
                  })
                )}
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="flex shadow-md justify-around m-2 mx-auto w-full border border-zinc-100 py-1 rounded-xl">
          {page !== 0 && (
            <button
              onClick={handlePrev}
              className="inline-flex items-center justify-center rounded-xl bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-500 focus:ring-4 focus:ring-blue-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              Show prev
            </button>
          )}
          <div className="text-gray-600 font-extrabold py-1">
            Page no. {page}
          </div>
          {(page + 1) * 20 <= data.length && (
            <button
              onClick={handleNext}
              className="inline-flex items-center justify-center rounded-xl bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-500 focus:ring-4 focus:ring-blue-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              Show next
            </button>
          )}
        </div>
      </div>
    );
  }

  // Fallback: when data is null or empty
  return (
    <div className="px-4 mt-28 w-[50%] max-h-[100vh] overflow-scroll">
      <div>No Data</div>
    </div>
  );
}