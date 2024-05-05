import React, { useEffect } from "react";


export const GroupPicker: React.FC<IProps> = (props) => {
    console.log("dario: 1GroupPicker props:", props);


    useEffect(() => {
        console.log('dario: selectedKey changed:', props.selectedKey);
    }, [props.selectedKey]);


    return (
        <>
            {props.legendData.map((item, index) => (
                <div key={`${item.value}`}>
                    <input
                        type="radio"
                        id={`${item.value}_${index}`}
                        name={props.groupName}
                        checked={props.selectedKey.value === item.value}
                        value={item.value}
                        onChange={() => props.onChange(item)} />
                    <label htmlFor={`${item.value}_${index}`}>{item.name}</label>
                </div>
            ))}
        </>
    );
};

interface LegendType {
    name: string;
    value: string;
}


interface IProps {
    groupName: string;
    legendData: Array<LegendType>;
    selectedKey: LegendType;
    onChange: (selectedKey: LegendType) => void;
}
