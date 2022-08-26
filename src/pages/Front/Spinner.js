import React from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import PulseLoader from "react-spinners/PulseLoader";

 const Spinner = props => {

    return <>
       	<div className="spin-back">
						<div className="jumbotron jum2">
							<PulseLoader
								size={20}
								color={"#192f59"}
								loading={true}
							/>
							<h3 className="qsand">{props.message}</h3>
						</div>
					</div>
    </>
}
export default Spinner;