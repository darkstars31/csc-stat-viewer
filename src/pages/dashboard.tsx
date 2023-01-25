import * as React from "react";
import { Container } from "../common/components/container";

export function Dashboard(){
    return (
        <Container>
            <div className="mx-auto max-w-xlg">
                <h2 className="text-3xl font-bold sm:text-4xl">CSC-Stattrak</h2>
                <p className="mt-4 text-gray-300">
                    Unofficial stats and analysis tools for CS:Confederation Draft Leagues
                </p>
                <div className="mt-4 text-gray-300">
                    This project was created by <a href="https://github.com/darkstars31/">Camps</a> and is open source on<br />
                    <a href="https://github.com/darkstars31/csc-stat-viewer" target="_blank" rel="noreferrer">GitHub</a>
                    <div>
                        If you think this project is helpful or awesome, throw me a star on GitHub
                    </div>
                </div>
                <div className="">

                </div>
            </div>
        </Container>
    );
}