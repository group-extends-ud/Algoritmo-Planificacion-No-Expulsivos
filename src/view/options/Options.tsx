import React from "react";
import './options.css';
import ProcessSettings from "./ProcessSettings";
import Semaphore from "./Semaphore";

const Options = () => (
    <div className='bottom'>
        <Semaphore />
        <ProcessSettings />
    </div>
);

export default Options;