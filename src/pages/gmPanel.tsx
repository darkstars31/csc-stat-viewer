import React, { useState } from "react";
import { useDataContext } from "../DataContext";
import { Container } from "../common/components/container";
import { useFetchFranchiseManagementIdsGraph } from "../dao/franchisesGraphQLDao";
import { RTLUploader } from "./gmPanel/rtlUploader";
import { AccoladeForm } from "./gmPanel/AccoladeForm";

export const GMPanel = () => {
    const { loggedinUser, gmRTLCsv, setGmRTLCsv } = useDataContext();
    const { data: franchiseManagementIds } = useFetchFranchiseManagementIdsGraph({ enabled: !!loggedinUser });
    const managementIds = franchiseManagementIds?.map(item => ([item.gm.id, item.agm.id, item.agms.map(agm => agm.id)]).flat()).filter(Boolean).flat() ?? [];

    const [selectedComponent, setSelectedComponent] = useState("RTLUploader");

    if (!managementIds.includes(loggedinUser?.id ?? "")) {
        return (
            <Container>
                You are not authorized to view this page
            </Container>
        );
    }

    const renderSelectedComponent = () => {
        switch (selectedComponent) {
            case "RTLUploader":
                return <RTLUploader gmRTLCsv={gmRTLCsv} setGmRTLCsv={setGmRTLCsv} />;
            case "AccoladeForm":
                return <AccoladeForm />;
            default:
                return null;
        }
    };

    return (
        <Container>
            <h1>GM Panel</h1>
            <div className="flex">
                <aside className="w-1/4 p-4">
                    <ul>
                        <li className={selectedComponent === "RTLUploader" ? "font-bold" : ""} onClick={() => setSelectedComponent("RTLUploader")}>RTL Uploader</li>
                        <li className={selectedComponent === "AccoladeForm" ? "font-bold" : ""} onClick={() => setSelectedComponent("AccoladeForm")}>Accolade Form</li>
                    </ul>
                </aside>
                <main className="w-3/4 p-4">         
                    {renderSelectedComponent()}
                </main>
            </div>
        </Container>
    );
}