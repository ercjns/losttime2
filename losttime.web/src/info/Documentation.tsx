import React from "react";
import { PageTitle } from "../shared/PageTitle";
import { EntriesDocs } from "./docs/EntriesDocs";
import { ResultsDocs } from "./docs/ResultsDocs";

export class Documentation extends React.Component<{}, {}, {}> {

    render () {
        return (
            <div>
            <PageTitle title="Documentation" />
            <EntriesDocs />
            <p></p>
            <ResultsDocs />
            </div>
        )
    };
}