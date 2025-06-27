import React from "react";
import { Input } from "../../common/components/forms/input";
import papa from "papaparse";
import { MdOutlineUploadFile } from "react-icons/md";

interface RTLUploaderProps {
    gmRTLCsv: Record<string, string>[] | null;
    setGmRTLCsv: (data: Record<string, string>[] | null) => void;
}

export const RTLUploader: React.FC<RTLUploaderProps> = ({ gmRTLCsv, setGmRTLCsv }) => {
    const [rtlUploadError, setRtlUploadError] = React.useState<Error | null>(null);
    const [isDragOver, setIsDragOver] = React.useState(false);

    React.useEffect(() => {
        setTimeout(() => {
            setRtlUploadError(null);
        }, 10000);
    }, [rtlUploadError]);

    const onHandleGmRTLCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRtlUploadError(null);
        setIsDragOver(false);
        const file = e.target.files?.[0];
        if (file && file.type === "text/csv") {
            const reader = new FileReader();
            reader.onload = (event) => {
                const fileContent = event.target?.result;
                if (fileContent && typeof fileContent === "string" && fileContent.trim().length > 0) {
                    const csvContent = fileContent.trim();
                    const isCsv = csvContent.includes(",") && csvContent.split("\n").every(line => line.split(",").length > 1);

                    if (!isCsv) {
                        setRtlUploadError(new Error("The uploaded file does not appear to be a valid CSV file."));
                        return;
                    }
                    if (!csvContent.includes("MMR") && !csvContent.includes("CSC ID")) {
                        setRtlUploadError(new Error("CSV is missing required columns: MMR and CSC ID. Are you sure this is a GM RTL CSV?"));
                        return;
                    }
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
                                setGmRTLCsv(result.data as Record<string, string>[]);
                            } else {
                                setRtlUploadError(new Error("Welp that's a new one. Please show Campsite this error. ${error}"));
                            }
                        },
                        error: (error: any) => {
                            setRtlUploadError(error);
                        },
                    });
                }
            };
            reader.readAsText(file);
        } else {
            if (file?.type !== "text/csv") {
                setRtlUploadError(new Error(`File uploaded was ${file?.type} and is not a valid CSV file. Please upload a valid GM RTL CSV file, found in #gm-documents`));
            }
        }
    };

    return (
        <div className="basis-1/3 space-y-3">
            <div className="text-center">Upload CSV File</div>
            <p>GM RTL Loader</p>
            {!gmRTLCsv ?
                <div
                    className="w-full rounded-lg border-2 border-dashed border-gray-300 p-6 text-center h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
                    onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); setRtlUploadError(null); }}
                    onDragLeave={(e => { e.preventDefault(); setIsDragOver(false); })}
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
                            {gmRTLCsv?.length ? `Loaded ${gmRTLCsv.length} Player MMRs` : ""}
                        </div>
                        <div className="bg-yellow-400 text-black p-1 m-1 rounded">
                            Warning. Please be careful not to expose MMR to the public.
                        </div>
                        <br />
                        <button className="rounded bg-red-500 h-6 m-1 p-1" onClick={() => setGmRTLCsv(null)}>Remove</button>
                    </div>
                </div>
            }
            {rtlUploadError && <div className="text-red-500">{rtlUploadError.message}</div>}
            <div className="text-sm mt-4">
                <div className="uppercase font-extrabold text-xl">Troubleshooting</div>
                <ul>
                    <li>
                        <p>If you get an error while using Firefox related to "application/vnd.ms-excel", this is most likely related to this issue:</p>
                        <p>If you are uncomfortable making registry edits as suggested in the article, using Chrome *should* work.</p>
                        <a className="hover:text-blue-400" href="https://support.mozilla.org/en-US/questions/1401889" target="_blank">https://support.mozilla.org/en-US/questions/1401889</a>.
                    </li>
                </ul>
            </div>
        </div>
    );
};

