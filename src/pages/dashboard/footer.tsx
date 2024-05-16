import * as React from "react";


export function DashboardFooter() {
    return (
        <footer className="bg-neutral-900 text-center text-white fixed bottom-0 w-full">
          <div
            className="p-2 justify-center text-sm"
            >
            © {new Date().getFullYear()} Copyright - {" "}
            <a className="text-whitehite" href="https://tonysanti.com/">Tony "Camps" Santi</a>
          </div>
        </footer>
    );
}