import React from "react";
import { useDataContext } from "../DataContext";
import { Container } from "../common/components/container";
import { Input } from "../common/components/forms/input";
import papa from "papaparse";
import { useFetchFranchiseManagementIdsGraph } from "../dao/franchisesGraphQLDao";
import { MdOutlineUploadFile } from "react-icons/md";

export const GMPanel = () => {
    const { loggedinUser, gmRTLCsv, setGmRTLCsv } = useDataContext();
    const { data: franchiseManagementIds, } = useFetchFranchiseManagementIdsGraph({ enabled: !!loggedinUser });
    const managementIds = franchiseManagementIds?.map( item => ([item.gm.id, item.agm.id,item.agms.map(agm => agm.id)]).flat()).filter(Boolean).flat() ?? [];
    
    if( !managementIds.includes(loggedinUser?.id ?? "")){
        return (
            <Container>
                You are not authorized to view this page
            </Container>
        )
    }

    const onHandleGmRTLCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file && file.type === "text/csv") {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const csvContent = event.target?.result;
                    if (csvContent) {
                        papa.parse(csvContent as string, {
                            header: true,
                            skipEmptyLines: true,
                            complete: (result) => {
                                if (result.data.map((item) => {
                                    if (typeof item === "object" && item !== null && "MMR" in item && "CSC ID" in item) {
                                        return true;
                                    }
                                    return false;
                                })) {
                                    console.log("CSV parsed successfully");
                                    setGmRTLCsv(result.data as Record<string, string>[]);
                                } else {
                                    console.error("CSV is missing required columns: MMR and CSC ID");
                                }
                            },
                            error: (error: any) => {
                                console.error("Error parsing CSV:", error);
                            },
                        });
                    }
                };
                reader.readAsText(file);
            }
        }

  return (
    <Container>
      <h1>GM Panel</h1>
      <div className="basis-1/3 space-y-3">
                          <div className="text-center">Upload CSV File</div>
                          <p>GM RTL Loader</p>
                          { !gmRTLCsv ? 
                              <div 
                                  className="w-full rounded-lg border-2 border-dashed border-gray-300 p-6 text-center h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
                                  onDragOver={(e) => e.preventDefault()}
                                  onDrop={(e) => {
                                      e.preventDefault();
                                      const file = e.dataTransfer.files?.[0];
                                      onHandleGmRTLCsv({ target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>);
                                  }}
                                  onClick={() => document.getElementById("fileInput")?.click()}
                              >
                                  <MdOutlineUploadFile size={"3rem"} className="text-gray-400 mb-3" />
                                  <span className="text-gray-600 font-medium">Drag & drop your GM RTL CSV file here, or <span className="text-blue-500 underline">browse</span></span>
                                  <Input
                                      id="fileInput"
                                      type="file"
                                      accept=".csv"
                                      className="hidden"
                                      onChange={onHandleGmRTLCsv}
                                  />
                              </div>
                          :
                          <div>
                              <div className="text-center">GM RTL CSV Uploaded</div>           
                              <div className="w-full rounded-lg border border-gray-500 p-4 text-center">
                                  CSV file has been uploaded successfully.
                                    <div>
                                        {gmRTLCsv?.length ? `Loaded ${gmRTLCsv.length} Player MMRs`: ""}
                                    </div>
                                    <div className="bg-yellow-400 text-black p-1 m-1 rounded">
                                        Warning. Please be careful not to expose MMR to the public.
                                    </div>
                                    <br />
                                  <button className="rounded bg-red-500 h-6 m-1 p-1" onClick={ () => setGmRTLCsv(null)}>Remove</button>
                              </div>
                          </div>
                          }
                      </div>
    </Container>
  );
}