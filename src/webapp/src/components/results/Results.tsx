import React from 'react';
import { PageTitle } from '../PageTitle';

export class Results extends React.Component<{}, {}, {}> {

    render () {
    return (
        <div>
            <PageTitle 
                title="Results" 
            />
            <p>
                A table of event results goes here. Or a list of classes if only one event.
            </p>
        </div>
    );
    }
}